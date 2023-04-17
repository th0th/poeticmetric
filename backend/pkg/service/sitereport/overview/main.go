package overview

import (
	"context"
	"math"

	"golang.org/x/sync/errgroup"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/utils"
)

type Report struct {
	AveragePageViewDuration                 uint64  `json:"averagePageViewDuration"`
	AveragePageViewDurationPercentageChange int16   `json:"averagePageViewDurationPercentageChange"`
	PageViewCount                           uint64  `json:"pageViewCount"`
	PageViewCountPercentageChange           int16   `json:"pageViewCountPercentageChange"`
	PageViewCountPerVisitor                 float64 `json:"pageViewCountPerVisitor"`
	PageViewCountPerVisitorPercentageChange int16   `json:"pageViewCountPerVisitorPercentageChange"`
	VisitorCount                            uint64  `json:"visitorCount"`
	VisitorCountPercentageChange            int16   `json:"visitorCountPercentageChange"`
}

func Get(dp *depot.Depot, filters *filter.Filters) (*Report, error) {
	previousReport := &Report{}
	report := &Report{}

	previousQ := filter.Apply(dp, &filter.Filters{
		BrowserName:            filters.BrowserName,
		BrowserVersion:         filters.BrowserVersion,
		CountryIsoCode:         filters.CountryIsoCode,
		DeviceType:             filters.DeviceType,
		End:                    filters.Start,
		Language:               filters.Language,
		Locale:                 filters.Locale,
		OperatingSystemName:    filters.OperatingSystemName,
		OperatingSystemVersion: filters.OperatingSystemVersion,
		Path:                   filters.Path,
		Referrer:               filters.Referrer,
		ReferrerSite:           filters.ReferrerSite,
		SiteId:                 filters.SiteId,
		Start:                  filters.Start.Add(filters.Start.Sub(filters.End)),
		TimeZone:               filters.TimeZone,
		UtmCampaign:            filters.UtmCampaign,
		UtmContent:             filters.UtmContent,
		UtmMedium:              filters.UtmMedium,
		UtmSource:              filters.UtmSource,
		UtmTerm:                filters.UtmTerm,
	})
	q := filter.Apply(dp, filters)

	errs, _ := errgroup.WithContext(context.Background())

	// queries - previousReport
	errs.Go(func() error {
		return previousQ.
			Session(&gorm.Session{}).
			Select(
				"count(distinct id) as page_view_count",
				"count(distinct visitor_id) as visitor_count",
			).
			Scan(previousReport).
			Error
	})

	errs.Go(func() error {
		return previousQ.
			Session(&gorm.Session{}).
			Select("if(isFinite(round(avg(duration))), round(avg(duration)), 0)").
			Where("duration != 0").
			Scan(&previousReport.AveragePageViewDuration).
			Error
	})

	// queries - report
	errs.Go(func() error {
		return q.
			Session(&gorm.Session{}).
			Select(
				"count(distinct id) as page_view_count",
				"count(distinct visitor_id) as visitor_count",
			).
			Scan(report).
			Error
	})

	errs.Go(func() error {
		return q.
			Session(&gorm.Session{}).
			Select("if(isFinite(round(avg(duration))), round(avg(duration)), 0)").
			Where("duration != 0").
			Scan(&report.AveragePageViewDuration).
			Error
	})

	err := errs.Wait()
	if err != nil {
		return nil, err
	}

	// calculations
	if previousReport.VisitorCount != 0 {
		previousReport.PageViewCountPerVisitor = math.Round(10*float64(previousReport.PageViewCount)/float64(previousReport.VisitorCount)) / 10
	}

	if report.VisitorCount != 0 {
		report.PageViewCountPerVisitor = math.Round(10*float64(report.PageViewCount)/float64(report.VisitorCount)) / 10
	}

	// TODO: replace the old ones with delta
	report.AveragePageViewDurationPercentageChange = utils.CalculatePercentageChange(previousReport.AveragePageViewDuration, report.AveragePageViewDuration)
	report.PageViewCountPercentageChange = utils.CalculatePercentageChange(previousReport.PageViewCount, report.PageViewCount)
	report.PageViewCountPerVisitorPercentageChange = utils.CalculatePercentageChange(previousReport.PageViewCountPerVisitor, report.PageViewCountPerVisitor)
	report.VisitorCountPercentageChange = utils.CalculatePercentageChange(previousReport.VisitorCount, report.VisitorCount)

	return report, nil
}
