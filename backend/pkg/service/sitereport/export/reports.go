package export

import (
	"archive/zip"
	"bytes"
	"fmt"
	"strings"

	"github.com/gocarina/gocsv"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
)

type BrowserDatum struct {
	BrowserName    string `csv:"Browser name"`
	BrowserVersion string `csv:"Browser version"`
	VisitorCount   uint64 `csv:"Visitor count"`
}

type CountryDatum struct {
	CountryIsoCode string `csv:"Country ISO code"`
	VisitorCount   uint64 `csv:"Visitor count"`
}

type DeviceTypeDatum struct {
	DeviceType   string `csv:"Device type"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type LanguageDatum struct {
	Language     string `csv:"Language"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type OperatingSystemDatum struct {
	OperatingSystemName    string `csv:"Operating system name"`
	OperatingSystemVersion string `csv:"Operating system version"`
	VisitorCount           uint64 `csv:"Visitor count"`
}

type PageDatum struct {
	AverageDuration  uint32  `csv:"Average duration"`
	BouncePercentage float32 `csv:"Bounce percentage"`
	Path             string  `csv:"Path"`
	Url              string  `csv:"URL"`
	ViewCount        uint64  `csv:"View count"`
	VisitorCount     uint64  `csv:"Visitor count"`
}

type ReferrerDatum struct {
	ReferrerSite string `csv:"Referrer site"`
	ReferrerPath string `csv:"Referrer path"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type TimeTrendsDatum struct {
	Day          uint8  `csv:"Day"`
	Hour         uint8  `csv:"Hour"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type UtmCampaignDatum struct {
	UtmCampaign  string `csv:"UTM campaign"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type UtmContentDatum struct {
	UtmContent   string `csv:"UTM content"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type UtmMediumDatum struct {
	UtmMedium    string `csv:"UTM medium"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type UtmSourceDatum struct {
	UtmSource    string `csv:"UTM source"`
	VisitorCount uint64 `csv:"Visitor count"`
}

type UtmTermDatum struct {
	UtmTerm      string `csv:"UTM term"`
	VisitorCount uint64 `csv:"Visitor count"`
}

func Reports(dp *depot.Depot, filters *filter.Filters) (*string, *bytes.Buffer, error) {
	result := &bytes.Buffer{}
	zipFolder := fmt.Sprintf("PoeticMetric export (reports) %s - %s", filters.Start.Format("2006-01-02"), filters.End.Format("2006-01-02"))
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
				"count(distinct visitor_id) as visitor_count",
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

		// languages
		languageData := []*LanguageDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("language is not null").
			Select(
				"language",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("language").
			Order("visitor_count desc").
			Find(&languageData).
			Error
		if err2 != nil {
			return err2
		}

		languageCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/languages.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(languageData, languageCsv)
		if err2 != nil {
			return err2
		}

		// country
		countryData := []*CountryDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("country_iso_code is not null").
			Select(
				"country_iso_code",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("country_iso_code").
			Order("visitor_count desc").
			Find(&countryData).
			Error
		if err2 != nil {
			return err2
		}

		countryCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/countries.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(countryData, countryCsv)
		if err2 != nil {
			return err2
		}

		// device type
		deviceTypeData := []*DeviceTypeDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("device_type is not null").
			Select(
				"device_type",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("device_type").
			Order("visitor_count desc").
			Find(&deviceTypeData).
			Error
		if err2 != nil {
			return err2
		}

		deviceTypeCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/device-types.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(deviceTypeData, deviceTypeCsv)
		if err2 != nil {
			return err2
		}

		// operating system
		operatingSystemData := []*OperatingSystemDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("operating_system_name is not null").
			Select(
				"operating_system_name",
				"operating_system_version",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("operating_system_name, operating_system_version").
			Order("visitor_count desc, operating_system_name").
			Find(&operatingSystemData).
			Error
		if err2 != nil {
			return err2
		}

		operatingSystemCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/operating-systems.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(operatingSystemData, operatingSystemCsv)
		if err2 != nil {
			return err2
		}

		// time trends
		timeTrendsData := []*TimeTrendsDatum{}

		err2 = func() error {
			valueSubQuery := baseQuery.
				Session(&gorm.Session{}).
				Select(
					strings.Join([]string{
						"toDayOfWeek(toTimeZone(date_time, @timeZone)) as day",
						"toHour(toStartOfInterval(toTimeZone(date_time, @timeZone), interval 1 hour)) as hour",
						"count(distinct visitor_id) as visitor_count",
					}, ", "),
					map[string]any{
						"timeZone": filters.GetTimeZone(),
					},
				).
				Group("day, hour")

			fillerSubQuery := dp.ClickHouse().
				Raw(
					strings.Join([]string{
						"select",
						strings.Join([]string{
							"arrayJoin(range(1, 8)) as day",
							"arrayJoin(range(0, 24)) as hour",
							"0 as visitor_count",
						}, ", "),
					}, " "),
				)

			err := dp.ClickHouse().
				Table("((?) union all (?))", valueSubQuery, fillerSubQuery).
				Select(
					strings.Join([]string{
						"day",
						"hour",
						"sum(visitor_count) as visitor_count",
					}, ", "),
				).
				Group("day, hour").
				Order("day, hour").
				Find(&timeTrendsData).
				Error
			if err != nil {
				return err
			}

			return nil
		}()
		if err2 != nil {
			return err2
		}

		timeTrendsCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/time-trends.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(timeTrendsData, timeTrendsCsv)
		if err2 != nil {
			return err2
		}

		// utm campaign
		utmCampaignData := []*UtmCampaignDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("utm_campaign is not null").
			Select(
				"utm_campaign",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("utm_campaign").
			Order("visitor_count desc").
			Find(&utmCampaignData).
			Error
		if err2 != nil {
			return err2
		}

		utmCampaignCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/utm-campaign.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(utmCampaignData, utmCampaignCsv)
		if err2 != nil {
			return err2
		}

		// utm content
		utmContentData := []*UtmContentDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("utm_content is not null").
			Select(
				"utm_content",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("utm_content").
			Order("visitor_count desc").
			Find(&utmContentData).
			Error
		if err2 != nil {
			return err2
		}

		utmContentCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/utm-content.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(utmContentData, utmContentCsv)
		if err2 != nil {
			return err2
		}

		// utm medium
		utmMediumData := []*UtmMediumDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("utm_medium is not null").
			Select(
				"utm_medium",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("utm_medium").
			Order("visitor_count desc").
			Find(&utmMediumData).
			Error
		if err2 != nil {
			return err2
		}

		utmMediumCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/utm-medium.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(utmMediumData, utmMediumCsv)
		if err2 != nil {
			return err2
		}

		// utm source
		utmSourceData := []*UtmSourceDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("utm_source is not null").
			Select(
				"utm_source",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("utm_source").
			Order("visitor_count desc").
			Find(&utmSourceData).
			Error
		if err2 != nil {
			return err2
		}

		utmSourceCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/utm-source.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(utmSourceData, utmSourceCsv)
		if err2 != nil {
			return err2
		}

		// utm term
		utmTermData := []*UtmTermDatum{}

		err2 = baseQuery.
			Session(&gorm.Session{}).
			Where("utm_term is not null").
			Select(
				"utm_term",
				"count(distinct visitor_id) as visitor_count",
			).
			Group("utm_term").
			Order("visitor_count desc").
			Find(&utmTermData).
			Error
		if err2 != nil {
			return err2
		}

		utmTermCsv, err2 := zipWriter.Create(fmt.Sprintf("%s/utm-term.csv", zipFolder))
		if err2 != nil {
			return err2
		}

		err2 = gocsv.Marshal(utmTermData, utmTermCsv)
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
