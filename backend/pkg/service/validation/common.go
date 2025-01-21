package validation

import (
	"context"
	_ "embed"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) organizationCanAddUser(ctx context.Context) *v.MessageValidator {
	mv := v.MessageValidator{
		Message: "has reached the maximum number of users",
	}

	mv.Validator = v.Func(func(field *v.Field) v.Errors {
		value, ok := field.Value.(uint)
		if !ok {
			return v.NewUnsupportedErrors("organizationCanHaveUser", field, "bool")
		}

		postgres := poeticmetric.ServicePostgres(ctx, s)

		canAddUser := false
		err := postgres.Raw(organizationCanAddUserQuery, map[string]any{
			"organizationID": value,
		}).Scan(&canAddUser).Error
		if err != nil {
			return v.NewErrors(field.Name, v.ErrUnsupported, err.Error())
		}

		if !canAddUser {
			return v.NewInvalidErrors(field, mv.Message)
		}

		return nil
	})

	return &mv
}

func (s *service) userUniqueEmail(ctx context.Context, userID *uint) *v.MessageValidator {
	mv := v.MessageValidator{
		Message: "is not unique",
	}

	mv.Validator = v.Func(func(field *v.Field) v.Errors {
		value, ok := field.Value.(string)
		if !ok {
			return v.NewUnsupportedErrors("userUniqueEmail", field, "string")
		}

		postgres := poeticmetric.ServicePostgres(ctx, s)

		q := postgres.
			Where(poeticmetric.User{Email: value}, "Email")
		if userID != nil {
			q = q.Not(poeticmetric.User{ID: *userID})
		}
		err := q.First(&poeticmetric.User{}).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return nil
			}

			return v.NewErrors(field.Name, v.ErrUnsupported, err.Error())
		}

		return v.NewInvalidErrors(field, mv.Message)
	})

	return &mv
}

//go:embed files/organization_can_add_user.sql
var organizationCanAddUserQuery string
