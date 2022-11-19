package sitereferrerdomainreport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	Count      uint64 `json:"count"`
	Domain     string `json:"domain"`
	Percentage uint16 `json:"percentage"`
}

type Report struct {
	Data []Datum `json:"data"`
}

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (*Report, error) {
	report := &Report{}

	baseQuery := sitereportfilters.Apply(dp, filters).
		Where("referrer is not null").
		Where("referrer in ('http', 'https')").
		Where("domain(referrer) != domain(url)")

	totalCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(*)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"count(domain(referrer)) as count",
				"domain(referrer) as domain",
				"toUInt16(round(100 * count / (@totalCountSubQuery))) as percentage",
			}, ", "),
			map[string]any{
				"totalCountSubQuery": totalCountSubQuery,
			},
		).
		Group("domain").
		Order("count desc").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
