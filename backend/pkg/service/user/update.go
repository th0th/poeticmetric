package user

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

type UpdatePayload struct {
	Name *string `json:"name"`
}

func Update(dp *depot.Depot, id uint64, payload *UpdatePayload) (*User, error) {
	err := validateUpdatePayload(payload)
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

func validateUpdatePayload(payload *UpdatePayload) error {
	errs := v.Validate(v.Schema{
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
