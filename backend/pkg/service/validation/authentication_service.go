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

func (s *service) ActivateUserParams(ctx context.Context, params *poeticmetric.ActivateUserParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("activationToken", params.ActivationToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, s.userActivationToken(ctx).Msg("Activation token is not valid."))
			}),
		),

		v.F("name", params.Name): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserNameMinLength, poeticmetric.UserNameMaxLength).Msg(fmt.Sprintf(
					"The user name must be between %d and %d characters long.",
					poeticmetric.UserNameMinLength,
					poeticmetric.UserNameMaxLength,
				)))
			}),
		),

		v.F("newPassword", params.NewPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"The password must be between %d and %d characters long.",
					poeticmetric.UserPasswordMinLength,
					poeticmetric.UserPasswordMaxLength,
				)))
			}),
		),

		v.F("newPassword2", params.NewPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.Eq(*params.NewPassword).Msg("Passwords do not match."))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

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

func (s *service) SignUpParams(ctx context.Context, params *poeticmetric.SignUpParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("organizationName", params.OrganizationName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.OrganizationNameMinLength, poeticmetric.OrganizationNameMaxLength).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					poeticmetric.OrganizationNameMinLength,
					poeticmetric.OrganizationNameMaxLength,
				)))
			}),
		),

		v.F("organizationTimeZone", params.OrganizationTimeZone): v.Any(
			v.Zero[*string](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, s.timeZone(ctx).Msg("Please provide a valid time zone."))
			}),
		),

		v.F("userEmail", params.UserEmail): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.All(
					vext.Email().Msg("Please provide a valid e-mail address."),
					vext.EmailNonDisposable().Msg("Please provide a non-disposable e-mail address."),
					s.userUniqueEmail(ctx, nil).Msg("This e-mail address is already in use."),
				))
			}),
		),

		v.F("userName", params.UserName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserNameMinLength, poeticmetric.UserNameMaxLength).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					poeticmetric.UserNameMinLength,
					poeticmetric.UserNameMaxLength,
				)))
			}),
		),

		v.F("userPassword", params.UserPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					poeticmetric.UserPasswordMinLength,
					poeticmetric.UserPasswordMaxLength,
				)))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
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

func (s *service) VerifyUserEmailAddressParams(ctx context.Context, userID uint, params *poeticmetric.VerifyUserEmailAddressParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("userEmailVerificationCode", params.UserEmailVerificationCode): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, s.userEmailVerificationCode(ctx, userID).Msg("Code is not valid."))
			}),
		),
	})

	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}

func (s *service) userActivationToken(ctx context.Context) *v.MessageValidator {
	mv := v.MessageValidator{
		Message: "is not valid",
	}

	mv.Validator = v.Func(func(field *v.Field) v.Errors {
		value, ok := field.Value.(string)
		if !ok {
			return v.NewUnsupportedErrors("userActivationToken", field, "string")
		}

		postgres := poeticmetric.ServicePostgres(ctx, s)

		err := postgres.First(&poeticmetric.User{}, poeticmetric.User{ActivationToken: &value}, "ActivationToken").Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return v.NewInvalidErrors(field, mv.Message)
			}

			return v.NewErrors(field.Name, v.ErrUnsupported, err.Error())
		}

		return nil
	})

	return &mv
}

func (s *service) userEmailVerificationCode(ctx context.Context, userID uint) *v.MessageValidator {
	mv := v.MessageValidator{
		Message: "is not valid",
	}

	mv.Validator = v.Func(func(field *v.Field) v.Errors {
		value, ok := field.Value.(string)
		if !ok {
			return v.NewUnsupportedErrors("userEmailVerificationCode", field, "string")
		}

		postgres := poeticmetric.ServicePostgres(ctx, s)

		err := postgres.
			First(&poeticmetric.User{}, poeticmetric.User{ID: userID, EmailVerificationCode: &value}, "ID", "EmailVerificationCode").
			Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return v.NewInvalidErrors(field, mv.Message)
			}

			return v.NewErrors(field.Name, v.ErrUnsupported, err.Error())
		}

		return nil
	})

	return &mv
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
