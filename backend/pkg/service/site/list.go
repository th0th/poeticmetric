package site

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func List(dp *depot.Depot, organizationId uint64) ([]*Site, error) {
	sites := []*Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Where("organization_id = ?", organizationId).
		Find(&sites).
		Error

	return sites, err
}
