package sitebrowsernamereport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	BrowserName       string `json:"browserName"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (Report, error) {
	report := Report{}

	baseQuery := sitereportfilters.Apply(dp, filters).
		Where("browser_name is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count (distinct visitor_id)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"browser_name",
				"count(distinct visitor_id) visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("browser_name").
		Order("visitor_count desc").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
