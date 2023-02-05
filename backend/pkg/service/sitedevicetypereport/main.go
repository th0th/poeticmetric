package sitedevicetypereport

import (
	"strings"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
)

type Datum struct {
	DeviceType        string `json:"deviceType"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *filter.Filters) (Report, error) {
	report := Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("device_type is not null").
		Where("referrer is null or domain(referrer) != domain(url)")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"device_type",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("device_type").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
