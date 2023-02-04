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
		Exec("optimize table events_buffer").
		Error
	if err != nil {
		return err
	}

	err = dp.ClickHouse().
		Table("events").
		Where("site_id = ?", id).
		Delete(nil).
		Error
	if err != nil {
		return err
	}

	return nil
}
