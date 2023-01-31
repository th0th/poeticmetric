package userself

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/useraccesstoken"
	"golang.org/x/crypto/bcrypt"
)

type ChangePasswordPayload struct {
	NewPassword  *string `json:"newPassword"`
	NewPassword2 *string `json:"newPassword2"`
}

func ChangePassword(dp *depot.Depot, id uint64, payload *ChangePasswordPayload) (*UserSelf, *useraccesstoken.UserAccessToken, error) {
	err := validateChangePasswordPayload(payload)
	if err != nil {
		return nil, nil, err
	}

	newPasswordByteSlice, err := bcrypt.GenerateFromPassword([]byte(*payload.NewPassword), 10)
	if err != nil {
		return nil, nil, err
	}

	userAccessToken := &useraccesstoken.UserAccessToken{}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err = dp.Postgres().
			Model(&model.User{}).
			Where("id = ?", id).
			Update("password", string(newPasswordByteSlice)).
			Error
		if err != nil {
			return err
		}

		err = dp.Postgres().
			Where("user_id = ?", id).
			Delete(&model.UserAccessToken{}).
			Error
		if err != nil {
			return err
		}

		userAccessToken, err = useraccesstoken.Create(dp, id)
		if err != nil {
			return err
		}

		return nil
	})
	if err != nil {
		return nil, nil, err
	}

	err = dp.Postgres().
		Model(&model.User{}).
		Where("id = ?", id).
		Update("password", string(newPasswordByteSlice)).
		Error
	if err != nil {
		return nil, nil, err
	}

	user, err := Read(dp, id)
	if err != nil {
		return nil, nil, err
	}

	return user, userAccessToken, nil
}

func validateChangePasswordPayload(payload *ChangePasswordPayload) error {
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
