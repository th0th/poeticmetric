package user

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

type UpdatePayload struct {
	IsOrganizationOwner *bool   `json:"isOrganizationOwner"`
	Name                *string `json:"name"`
}

func Update(dp *depot.Depot, id uint64, payload *UpdatePayload) (*User, error) {
	err := validateUpdatePayload(dp, id, payload)
	if err != nil {
		return nil, err
	}

	update := &model.User{}
	fields := []string{}

	if payload.Name != nil {
		update.Name = *payload.Name
		fields = append(fields, "name")
	}

	if len(fields) > 0 {
		err = dp.Postgres().
			Model(&model.User{}).
			Select(fields).
			Where("id = ?", id).
			Updates(update).
			Error
		if err != nil {
			return nil, err
		}
	}

	return Read(dp, id)
}

func validateUpdatePayload(dp *depot.Depot, id uint64, payload *UpdatePayload) error {
	errs := v.Validate(v.Schema{
		v.F("isOrganizationOwner", payload.IsOrganizationOwner): v.Any(
			v.Zero[*bool](),

			v.Is(func(t *bool) bool {
				return !validator.OrganizationOwner(dp, id) && !*t
			}),

			v.Is(func(t bool) bool {
				return validator.UserActive(dp, id) && validator.UserEmailVerified(dp, id)
			}).Msg("The team member should have an activated account and has their e-mail verified before transferring the owner role."),
		),

		v.F("name", payload.Name): v.Any(
			v.Zero[*string](),

			v.Is(func(t *string) bool {
				return len(*t) >= model.UserNameMinLength && len(*t) <= model.UserNameMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.UserNameMinLength,
				model.UserNameMaxLength,
			)),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
