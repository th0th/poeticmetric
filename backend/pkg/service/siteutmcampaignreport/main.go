package siteutmcampaignreport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	UtmCampaign       string `json:"utmCampaign"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (Report, error) {
	report := Report{}

	baseQuery := sitereportfilters.Apply(dp, filters).
		Where("utm_campaign is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"utm_campaign",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("utm_campaign").
		Order("visitor_count desc").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
