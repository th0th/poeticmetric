package useraccesstoken

import (
	"github.com/dchest/uniuri"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

func Create(dp *depot.Depot, userId uint64) (*UserAccessToken, error) {
	token := ""

	// check for uniqueness
	for true {
		token = uniuri.NewLen(36)

		if !validator.UserAccessToken(dp, token) {
			break
		}
	}

	modelUserAccessToken := &model.UserAccessToken{
		Token:  token,
		UserId: userId,
	}

	err := dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Create(modelUserAccessToken).
			Error
		if err2 != nil {
			return err2
		}

		err2 = dp2.Postgres().
			Model(&model.User{}).
			Where("id = ?", modelUserAccessToken.UserId).
			Update("last_access_token_created_at", modelUserAccessToken.CreatedAt).
			Error
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	userAccessToken, err := Read(dp, modelUserAccessToken.Id)
	if err != nil {
		return nil, err
	}

	return userAccessToken, nil
}
