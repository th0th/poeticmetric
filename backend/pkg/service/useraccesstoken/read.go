package useraccesstoken

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func Read(dp *depot.Depot, id uint64) (*UserAccessToken, error) {
	modelUserAccessToken := &model.UserAccessToken{}
	userAccessToken := &UserAccessToken{}

	err := dp.Postgres().
		Model(modelUserAccessToken).
		Where("id = ?", id).
		First(userAccessToken).
		Error
	if err != nil {
		return nil, err
	}

	return userAccessToken, nil
}
