package useraccesstoken

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

func ListByUserId(dp *depot.Depot, userId uint64) ([]*UserAccessToken, error) {
	userAccessTokens := []*UserAccessToken{}

	err := dp.Postgres().
		Model(&model.UserAccessToken{}).
		Where("user_id = ?", userId).
		Find(&userAccessTokens).
		Error
	if err != nil {
		return nil, err
	}

	return userAccessTokens, nil
}
