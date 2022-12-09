package sitereferrerpathreport

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	ReferrerPath      string `json:"referrerPath"`
	Referrer          string `json:"referrer"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *filter.Filters) (Report, error) {
	err := validateFilters(filters)
	if err != nil {
		return nil, err
	}

	report := Report{}

	baseQuery := filter.Apply(dp, filters)

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	baseSubQuery := dp.ClickHouse().
		Table("(?)", baseQuery).
		Select(
			strings.Join([]string{
				"referrer",
				"pathFull(referrer) as referrer_path",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("referrer").
		Order("visitor_count desc")

	err = dp.ClickHouse().
		Table("(?)", baseSubQuery).
		Select(
			"referrer",
			"referrer_path",
			"visitor_count",
			"visitor_percentage",
		).
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}

func validateFilters(filters *filter.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("referrerSite", filters.ReferrerSite): v.All(
			v.Nonzero[*string]().Msg("This field is required."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
