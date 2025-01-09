package authentication

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

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
