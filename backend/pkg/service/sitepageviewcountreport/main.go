package sitepageviewcountreport

import (
	"fmt"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
	"strings"
)

type Datum struct {
	Page                string `json:"page"`
	Url                 string `json:"url"`
	ViewCount           uint64 `json:"viewCount"`
	ViewCountPercentage uint16 `json:"viewCountPercentage"`
}

type Report struct {
	Data []Datum `json:"data"`
}

func Get(dp *depot.Depot, filters *sitereportfilters.Filters) (*Report, error) {
	report := &Report{}

	modelSite := &model.Site{}

	err := dp.Postgres().
		Where("id = ?", filters.SiteId).
		First(modelSite).
		Error
	if err != nil {
		return nil, err
	}

	q := sitereportfilters.Apply(dp, filters)

	totalCountSubQuery := q.
		Session(&gorm.Session{}).
		Select("count(*)")

	err = q.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"page",
				fmt.Sprintf("concat('https://%s', page) as url", modelSite.Domain),
				"count(*) as view_count",
				"toUInt16(round(100 * count(*) / (@totalCountSubQuery), 2)) as view_count_percentage",
			}, ","),
			map[string]any{
				"totalCountSubQuery": totalCountSubQuery,
			},
		).
		Group("page").
		Order("view_count desc").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
