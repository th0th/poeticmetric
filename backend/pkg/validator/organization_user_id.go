package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func OrganizationUserId(dp *depot.Depot, organizationId uint64, userId uint64) bool {
	var count int64

	err := dp.Postgres().
		Model(&model.User{}).
		Where("organization_id = ?", organizationId).
		Where("id = ?", userId).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
