package siteoperatingsystemnamereport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	OperatingSystemName string `json:"operatingSystemName"`
	VisitorCount        uint64 `json:"visitorCount"`
	VisitorPercentage   uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *filter.Filters) (Report, error) {
	report := Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("operating_system_name is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"operating_system_name",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("operating_system_name").
		Order("visitor_count desc").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
