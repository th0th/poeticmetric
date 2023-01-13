package userself

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userpassword"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

type ActivatePayload struct {
	ActivationToken *string `json:"activationToken"`
	NewPassword     *string `json:"newPassword"`
	NewPassword2    *string `json:"newPassword2"`
}

func Activate(dp *depot.Depot, payload *ActivatePayload) (*UserSelf, error) {
	err := validateActivatePayload(dp, payload)
	if err != nil {
		return nil, err
	}

	userPassword, err := userpassword.GetHash(*payload.NewPassword)
	if err != nil {
		return nil, err
	}

	modelUser := &model.User{}

	err = dp.Postgres().
		Model(&model.User{}).
		Select("id").
		Where("activation_token = ?", *payload.ActivationToken).
		First(modelUser).
		Error
	if err != nil {
		return nil, err
	}

	err = dp.Postgres().
		Model(&model.User{}).
		Select("activation_token", "is_active", "is_email_verified").
		Where("activation_token = ?", *payload.ActivationToken).
		Updates(&model.User{
			ActivationToken: nil,
			IsActive:        true,
			IsEmailVerified: true,
			Password:        userPassword,
		}).
		Error
	if err != nil {
		return nil, err
	}

	return Read(dp, modelUser.Id)
}

func validateActivatePayload(dp *depot.Depot, payload *ActivatePayload) error {
	errs := v.Validate(v.Schema{
		v.F("activationToken", payload.ActivationToken): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.UserActivationToken(dp, *t)
			}).Msg("This activation token is not valid."),
		),

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

			v.Is(
				func(t *string) bool {
					if payload.NewPassword == nil {
						return true
					}

					return *t == *payload.NewPassword
				}).Msg("Passwords don't match."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
