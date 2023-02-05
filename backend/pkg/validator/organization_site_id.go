package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func OrganizationSiteId(dp *depot.Depot, organizationId uint64, siteId uint64) bool {
	var count int64

	err := dp.Postgres().
		Model(&model.Site{}).
		Where("organization_id = ?", organizationId).
		Where("id = ?", siteId).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
