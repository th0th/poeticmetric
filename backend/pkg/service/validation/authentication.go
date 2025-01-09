package validation

import (
	"context"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ChangeUserPasswordParams(ctx context.Context, params *poeticmetric.ChangeUserPasswordParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("newPassword", params.NewPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"New password should be between %d and %d characters in length.",
					poeticmetric.UserPasswordMinLength,
					poeticmetric.UserPasswordMaxLength,
				)))
			}),
		),

		v.F("newPassword2", params.NewPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Any(
				v.Is(func(_ *string) bool {
					return params.NewPassword == nil
				}),

				v.Nested(func(x *string) v.Validator {
					return v.Value(*x, v.Eq(*params.NewPassword).Msg("Passwords don't match."))
				}),
			),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

func (s *service) ResetUserPasswordParams(ctx context.Context, params *poeticmetric.ResetUserPasswordParams) error {
	errs := []error{}

	validationErrs := v.Validate(v.Schema{
		v.F("passwordResetToken", params.PasswordResetToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(x *string) bool {
				isValid, err := s.userPasswordResetToken(ctx, *x)
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

func (s *service) SendUserPasswordRecoveryEmailParams(ctx context.Context, params *poeticmetric.SendUserPasswordRecoveryEmailParams) error {
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

func (s *service) UpdateAuthenticationUserParams(ctx context.Context, params *poeticmetric.UpdateAuthenticationUserParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("name", params.Name): v.Any(
			v.Zero[*string](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserNameMinLength, poeticmetric.UserNameMaxLength).Msg(fmt.Sprintf(
					"The name must be between %d and %d characters long.",
					poeticmetric.UserNameMinLength,
					poeticmetric.UserNameMaxLength,
				)))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

func (s *service) userPasswordResetToken(ctx context.Context, token string) (bool, error) {
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
