package userself

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

func Read(dp *depot.Depot, id uint64) (*UserSelf, error) {
	userSelf := &UserSelf{}

	err := dp.Postgres().
		Model(&model.User{}).
		Where("id = ?", id).
		First(userSelf).
		Error
	if err != nil {
		return nil, err
	}

	return userSelf, err
}
