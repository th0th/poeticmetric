package siteoperatingsystemversionreport

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	OperatingSystemVersion string `json:"operatingSystemVersion"`
	VisitorCount           uint64 `json:"visitorCount"`
	VisitorPercentage      uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (Report, error) {
	err := validateFilters(filters)
	if err != nil {
		return nil, err
	}

	report := Report{}

	baseQuery := sitereportfilters.Apply(dp, filters).
		Where("operating_system_version is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	err = baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"operating_system_version",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("operating_system_version").
		Order("visitor_count desc").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}

func validateFilters(filters *sitereportfilters.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("operatingSystemName", filters.OperatingSystemName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
