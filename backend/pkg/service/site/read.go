package site

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
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
