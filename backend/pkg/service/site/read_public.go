package site

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func ReadPublic(dp *depot.Depot, domain string) (*Site, error) {
	site := &Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Joins("inner join organizations on organizations.id = sites.organization_id").
		Where("organizations.plan_id is not null").
		Where("sites.is_public is true").
		Where("sites.domain = ?", domain).
		First(site).
		Error
	if err != nil {
		return nil, err
	}

	return site, nil
}
