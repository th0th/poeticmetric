package authentication

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ChangeUserPassword(ctx context.Context, userID uint, params *poeticmetric.ChangeUserPasswordParams) error {
	err := s.validationService.ChangeUserPasswordParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{ID: userID}
	err = postgres.Select("ID").First(&user, user, "ID").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = user.SetPassword(*params.NewPassword)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx context.Context) error {
		postgres2 := poeticmetric.ServicePostgres(ctx, s)

		err2 := postgres2.Model(&user).Select("Password").UpdateColumns(&user).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = postgres2.Where(&poeticmetric.UserAccessToken{UserID: userID}).Delete(&poeticmetric.UserAccessToken{}).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
