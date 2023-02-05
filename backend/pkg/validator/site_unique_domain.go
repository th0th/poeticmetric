package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func SiteUniqueDomain(dp *depot.Depot, v string, siteId *uint64) bool {
	var count int64

	q := dp.Postgres().
		Model(&model.Site{}).
		Where("domain = ?", v)

	if siteId != nil {
		q.Where("id != ?", siteId)
	}

	err := q.Count(&count).Error
	if err != nil {
		panic(err)
	}

	return count == 0
}
