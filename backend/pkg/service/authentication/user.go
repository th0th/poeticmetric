package authentication

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ActivateUser(ctx context.Context, params *poeticmetric.ActivateUserParams) error {
	err := s.validationService.ActivateUserParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{}
	err = postgres.
		Model(&poeticmetric.User{}).
		Select("ID").
		First(&user, poeticmetric.User{ActivationToken: params.ActivationToken}, "ActivationToken").
		Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	user.IsActive = true
	user.IsEmailVerified = true
	user.Name = *params.Name
	err = user.SetPassword(*params.NewPassword)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = postgres.Model(&user).Select("ActivationToken", "IsActive", "IsEmailVerified", "Name", "Password").Updates(user).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) UpdateUser(ctx context.Context, userID uint, params *poeticmetric.UpdateAuthenticationUserParams) error {
	err := s.validationService.UpdateAuthenticationUserParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	update := poeticmetric.User{}
	var fields []string

	if params.Name != nil {
		update.Name = *params.Name
		fields = append(fields, "Name")
	}

	if len(fields) > 0 {
		postgres := poeticmetric.ServicePostgres(ctx, s)
		err = postgres.Model(&poeticmetric.User{ID: userID}).Select(fields).Updates(update).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}
	}

	return nil
}
