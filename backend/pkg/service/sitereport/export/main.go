package export

import (
	"archive/zip"
	"bytes"
	"fmt"

	"github.com/gocarina/gocsv"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
)

type BrowserDatum struct {
	BrowserName    string `csv:"Browser name"`
	BrowserVersion string `csv:"Browser version"`
	VisitorCount   uint64 `csv:"Visitor count"`
}

type PageDatum struct {
	AverageDuration   uint32  `csv:"Average duration"`
	BouncePercentage  float32 `csv:"Bounce percentage"`
	Path              string  `csv:"Path"`
	Url               string  `csv:"URL"`
	ViewCount         uint64  `csv:"View count"`
	ViewPercentage    float32 `csv:"View percentage"`
	VisitorCount      uint64  `csv:"Visitor count"`
	VisitorPercentage float32 `csv:"Visitor percentage"`
}

type ReferrerDatum struct {
	ReferrerSite string `csv:"Referrer site"`
	ReferrerPath   string `csv:"Referrer path"`
	VisitorCount   uint64 `csv:"Visitor count"`
}

func Get(dp *depot.Depot, filters *filter.Filters) (*string, *bytes.Buffer, error) {
	result := &bytes.Buffer{}
	zipFolder := fmt.Sprintf("PoeticMetric export %s - %s", filters.Start.Format("2006-01-02"), filters.End.Format("2006-01-02"))
	zipWriter := zip.NewWriter(result)

	baseQuery := filter.Apply(dp, filters)

	err := func() error {
		// browser
		browserData := []*BrowserDatum{}

		err2 := baseQuery.
			Session(&gorm.Session{}).
			Select(
				"browser_name",
				"browser_version",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("browser_name, browser_version").
			Order("visitor_count desc").
			Find(&browserData).
			Error
		if err2 != nil {
			return err2
		}

		browserCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/browsers.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(browserData, browserCsv)
		if err2 != nil {
			return err2
		}

		// pages
		pageData := []*PageDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Joins("cross join (select count(distinct visitor_id) as count from events_buffer) total_visitors").
			Joins("cross join (select count(1) as count from events_buffer) total_views").
			Select(
				"round(avg(duration)) as average_duration",
				"round(100 * countIf(duration == 0) / view_count) as bounce_percentage",
				"pathFull(url) as path",
				"url",
				"count(*) as view_count",
				"round(100 * view_count / total_views.count) as view_percentage",
				"count(distinct visitor_id) as visitor_count",
				"round(100 * visitor_count / total_visitors.count) as visitor_percentage",
			).
			Group("path, url, total_visitors.count, total_views.count").
			Order("visitor_count desc, path").
			Find(&pageData).
			Error
		if err2 != nil {
			return err2
		}

		pageCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/pages.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(pageData, pageCsv)
		if err2 != nil {
			return err2
		}

		// referrers
		referrerData := []*ReferrerDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("referrer is not null").
			Where("protocol(referrer) in ('http', 'https')").
			Where("domain(referrer) != domain(events_buffer.url)").
			Select(
				"concat(protocol(referrer), '://', domain(referrer)) as referrer_site",
				"pathFull(referrer) as referrer_path",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("referrer_site, referrer_path").
			Order("visitor_count desc, referrer_site").
			Find(&referrerData).
			Error
		if err2 != nil {
			return err2
		}

		referrerCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/referrers.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(referrerData, referrerCsv)
		if err2 != nil {
			return err2
		}

		err2 = zipWriter.Close()
		if err2 != nil {
			return err2
		}

		return nil
	}()
	if err != nil {
		return nil, nil, err
	}

	return &zipFolder, result, nil
}
