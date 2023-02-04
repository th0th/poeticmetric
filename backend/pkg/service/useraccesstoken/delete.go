package useraccesstoken

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"gorm.io/gorm"
)

func Delete(dp *depot.Depot, id uint64) error {
	query := dp.Postgres().
		Where("id = ?", id).
		Delete(&model.UserAccessToken{})
	if query.Error != nil {
		return query.Error
	}

	if query.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return nil
}
