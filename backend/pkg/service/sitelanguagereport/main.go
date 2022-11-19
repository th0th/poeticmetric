package sitelanguagereport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	Language          string `json:"language"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type Report struct {
	Data []Datum `json:"data"`
}

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (*Report, error) {
	report := &Report{}

	baseQuery := sitereportfilters.Apply(dp, filters).
		Where("language is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(strings.Join(
			[]string{
				"language",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("language").
		Order("visitor_count desc").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
