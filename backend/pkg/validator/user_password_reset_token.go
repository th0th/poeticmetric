package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func UserPasswordResetToken(dp *depot.Depot, v string) bool {
	var count int64

	err := dp.Postgres().
		Model(&model.User{}).
		Where("password_reset_token = ?", v).
		Limit(1).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
