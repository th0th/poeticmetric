package userself

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userpassword"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

type ResetPasswordPayload struct {
	NewPassword        *string `json:"newPassword"`
	NewPassword2       *string `json:"newPassword2"`
	PasswordResetToken *string `json:"passwordResetToken"`
}

func ResetPassword(dp *depot.Depot, payload *ResetPasswordPayload) (*UserSelf, error) {
	err := validateResetPasswordPayload(dp, payload)
	if err != nil {
		return nil, err
	}

	passwordHash, err := userpassword.GetHash(*payload.NewPassword)
	if err != nil {
		return nil, err
	}

	modelUser := &model.User{}

	err = dp.Postgres().
		Model(&model.User{}).
		Select("id").
		Where("password_reset_token = ?", *payload.PasswordResetToken).
		First(modelUser).
		Error
	if err != nil {
		return nil, err
	}

	userSelf := &UserSelf{}

	err = dp.Postgres().
		Model(&model.User{}).
		Select("password", "password_reset_token").
		Where("password_reset_token = ?", *payload.PasswordResetToken).
		Updates(&model.User{
			Password:           passwordHash,
			PasswordResetToken: nil,
		}).
		Error
	if err != nil {
		return nil, err
	}

	userSelf, err = Read(dp, modelUser.Id)
	if err != nil {
		return nil, err
	}

	return userSelf, nil
}

func validateResetPasswordPayload(dp *depot.Depot, payload *ResetPasswordPayload) error {
	errs := v.Validate(v.Schema{
		v.F("newPassword", payload.NewPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.UserPasswordMinLength && len(*t) <= model.UserPasswordMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.UserPasswordMinLength,
				model.UserPasswordMaxLength,
			)),
		),

		v.F("newPassword2", payload.NewPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return payload.NewPassword != nil && *payload.NewPassword2 == *payload.NewPassword
			}).Msg("Passwords don't match."),
		),

		v.F("passwordResetToken", payload.PasswordResetToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.UserPasswordResetToken(dp, *t)
			}).Msg("This password reset token is not valid."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
