package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func UserActive(dp *depot.Depot, id uint64) bool {
	modelUser := &model.User{}

	err := dp.Postgres().
		Model(&model.User{}).
		Where("id = ?", id).
		First(modelUser).
		Error
	if err != nil {
		panic(err)
	}

	return modelUser.IsActive
}
