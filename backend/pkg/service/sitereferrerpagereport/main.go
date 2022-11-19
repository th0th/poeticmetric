package sitereferrerpagereport

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	Path       string `json:"path"`
	Count      uint64 `json:"count"`
	Percentage uint16 `json:"percentage"`
	Url        string `json:"url"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (Report, error) {
	err := validateFilters(filters)
	if err != nil {
		return nil, err
	}

	report := Report{}

	baseQuery := sitereportfilters.Apply(dp, filters)

	totalCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(*)")

	baseSubQuery := dp.ClickHouse().
		Table("(?)", baseQuery).
		Select(
			strings.Join([]string{
				"count(*) as count",
				"concat(protocol(referrer), '://', domain(referrer)) as domain",
				"pathFull(referrer) as path",
				"toUInt16(round(100 * count / (@totalCountSubQuery))) as percentage",
				"concat(domain, path) as url",
			}, ", "),
			map[string]any{
				"totalCountSubQuery": totalCountSubQuery,
			},
		).
		Group("path, domain").
		Order("count desc")

	err = dp.ClickHouse().
		Table("(?)", baseSubQuery).
		Select(
			"count",
			"path",
			"percentage",
			"url",
		).
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}

func validateFilters(filters *sitereportfilters.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("referrerSite", filters.ReferrerDomain): v.All(
			v.Nonzero[*string]().Msg("This field is required."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
