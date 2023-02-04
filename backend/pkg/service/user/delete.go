package user

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"gorm.io/gorm"
)

func Delete(dp *depot.Depot, id uint64) error {
	q := dp.Postgres().
		Where("id = ?", id).
		Delete(&model.User{})
	if q.Error != nil {
		return q.Error
	}

	if q.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
