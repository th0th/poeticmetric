package site

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

func Delete(dp *depot.Depot, id uint64) error {
	err := dp.Postgres().
		Where("id = ?", id).
		Delete(&model.Site{}).
		Error
	if err != nil {
		return err
	}

	err = dp.ClickHouse().
		Where("site_id = ?", id).
		Delete(&model.Event{}).
		Error
	if err != nil {
		// TODO: handle error
	}

	return nil
}
