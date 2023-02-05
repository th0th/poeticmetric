package site

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func Read(dp *depot.Depot, id uint64) (*Site, error) {
	s := &Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Where("id = ?", id).
		First(s).
		Error

	return s, err
}
