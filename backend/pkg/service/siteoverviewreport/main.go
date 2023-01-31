package siteoverviewreport

import (
	"context"
	"math"

	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"golang.org/x/sync/errgroup"
	"gorm.io/gorm"
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
		DeviceType:             filters.CountryIsoCode,
		End:                    filters.Start,
		Language:               filters.Language,
		Locale:                 filters.Locale,
		OperatingSystemName:    filters.OperatingSystemName,
		OperatingSystemVersion: filters.OperatingSystemVersion,
		Path:                   filters.Path,
		ReferrerSite:           filters.ReferrerSite,
		SiteId:                 filters.SiteId,
		Start:                  filters.Start.Add(filters.End.Sub(filters.Start)),
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
			Select("if(isFinite(round(avg(duration))), round(avg(duration)), 0)").
			Where("duration != 0").
			Scan(&previousReport.AveragePageViewDuration).
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

	errs.Go(func() error {
		return previousQ.
			Session(&gorm.Session{}).
			Select("count(distinct id)").
			Scan(&previousReport.PageViewCount).
			Error
	})

	errs.Go(func() error {
		return previousQ.
			Session(&gorm.Session{}).
			Select("count(distinct visitor_id)").
			Scan(&previousReport.VisitorCount).
			Error
	})

	// queries - report
	errs.Go(func() error {
		return q.
			Session(&gorm.Session{}).
			Select("if(isFinite(round(avg(duration))), round(avg(duration)), 0)").
			Where("duration != 0").
			Scan(&report.AveragePageViewDuration).
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

	errs.Go(func() error {
		return q.
			Session(&gorm.Session{}).
			Select("count(distinct id)").
			Scan(&report.PageViewCount).
			Error
	})

	errs.Go(func() error {
		return q.
			Session(&gorm.Session{}).
			Select("count(distinct visitor_id)").
			Scan(&report.VisitorCount).
			Error
	})

	err := errs.Wait()
	if err != nil {
		return nil, err
	}

	// calculations
	report.AveragePageViewDurationPercentageChange = calculateUint64PercentageChange(previousReport.AveragePageViewDuration, report.AveragePageViewDuration)
	report.PageViewCountPercentageChange = calculateUint64PercentageChange(previousReport.PageViewCount, report.PageViewCount)
	report.PageViewCountPerVisitorPercentageChange = calculateFloat64PercentageChange(previousReport.PageViewCountPerVisitor, report.PageViewCountPerVisitor)
	report.VisitorCountPercentageChange = calculateUint64PercentageChange(previousReport.VisitorCount, report.VisitorCount)

	if report.VisitorCount != 0 {
		report.PageViewCountPerVisitor = math.Round(10*float64(report.PageViewCount)/float64(report.VisitorCount)) / 10
	}

	return report, nil
}

func calculateFloat64PercentageChange(oldValue float64, newValue float64) int16 {
	if oldValue == 0 {
		if newValue == 0 {
			return 0
		}

		return 100
	}

	return int16(math.Round(100 * ((newValue - oldValue) / oldValue)))
}

func calculateUint64PercentageChange(oldValue uint64, newValue uint64) int16 {
	return calculateFloat64PercentageChange(float64(oldValue), float64(newValue))
}
