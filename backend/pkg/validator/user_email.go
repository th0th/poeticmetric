package validator

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

func UserEmail(dp *depot.Depot, v string) bool {
	var count int64

	err := dp.Postgres().
		Model(&model.User{}).
		Where("email = ?", v).
		Limit(1).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
