package sitepathdurationreport

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
)

type Datum struct {
	AverageDuration uint64 `json:"averageDuration"`
	Path            string `json:"path"`
	Url             string `json:"url"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *filter.Filters) (Report, error) {
	report := Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("duration != 0")

	err := baseQuery.
		Session(&gorm.Session{}).
		Select(
			"round(avg(duration)) as average_duration",
			"path",
			"url",
		).
		Group("path, url").
		Order("average_duration desc, path asc").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
