package useraccesstoken

import (
	"github.com/google/uuid"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func Create(dp *depot.Depot, userId uint64) (*UserAccessToken, error) {
	modelUserAccessToken := &model.UserAccessToken{
		Token:  uuid.NewString(),
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
			Update("LastAccessTokenCreatedAt", modelUserAccessToken.CreatedAt).
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
