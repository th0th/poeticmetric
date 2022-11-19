package sitepageviewdurationreport

import (
	"fmt"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
	"gorm.io/gorm"
)

type Datum struct {
	Page         string `json:"page"`
	Url          string `json:"url"`
	ViewDuration uint64 `json:"viewDuration"`
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

	err = q.
		Session(&gorm.Session{}).
		Select(
			"page",
			fmt.Sprintf("concat('https://%s', page) as url", modelSite.Domain),
			"round(avg(duration)) as view_duration",
		).
		Group("page").
		Order("round(avg(duration)) desc").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
