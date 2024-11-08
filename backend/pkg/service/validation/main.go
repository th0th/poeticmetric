package validation

import (
	"context"
	"errors"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Postgres *gorm.DB
}

type service struct {
	postgres *gorm.DB
}

func New(params NewParams) poeticmetric.ValidationService {
	return &service{
		postgres: params.Postgres,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) AuthenticationResetUserPasswordParams(ctx context.Context, params *poeticmetric.AuthenticationResetUserPasswordParams) error {
	errs := []error{}

	validationErrs := v.Validate(v.Schema{
		v.F("passwordResetToken", params.PasswordResetToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(x *string) bool {
				isValid, err := s.validateUserPasswordResetToken(ctx, *x)
				if err != nil {
					errs = append(errs, err)
				}

				return isValid
			}).Msg("Password reset token is not valid."),
		),

		v.F("userPassword", params.UserPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"The password must be between %d and %d characters long.",
					poeticmetric.UserPasswordMinLength,
					poeticmetric.UserPasswordMaxLength,
				)))
			}),
		),

		v.F("userPassword2", params.UserPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.Eq(*params.UserPassword).Msg("Passwords do not match."))
			}),
		),
	})
	if len(errs) > 0 {
		return errors.Join(errs...)
	}
	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) AuthenticationSendUserPasswordRecoveryEmailParams(ctx context.Context, params *poeticmetric.AuthenticationSendUserPasswordRecoveryEmailParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("email", params.Email): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, vext.Email().Msg("Please provide a valid e-mail address."))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

func (s *service) validateUserPasswordResetToken(ctx context.Context, token string) (bool, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	err := postgres.Select("PasswordResetToken").First(&poeticmetric.User{}, poeticmetric.User{PasswordResetToken: &token}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}

		return false, err
	}

	return true, nil
}
