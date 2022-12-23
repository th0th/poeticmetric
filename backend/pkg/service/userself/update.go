package userself

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

type UpdatePayload struct {
	Name *string `json:"name"`
}

func Update(dp *depot.Depot, id uint64, payload *UpdatePayload) (*UserSelf, error) {
	err := validateUpdatePayload(payload)
	if err != nil {
		return nil, err
	}

	update := &model.User{}
	updateFields := []string{}

	if payload.Name != nil {
		update.Name = *payload.Name
		updateFields = append(updateFields, "name")
	}

	if len(updateFields) > 0 {
		err = dp.Postgres().
			Where("id = ?", id).
			Select(updateFields).
			Updates(&update).
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
			v.All(
				v.Nonzero[*string]().Msg("This field is required."),

				v.Is(
					func(t *string) bool {
						return len(*t) >= model.UserNameMinLength && len(*t) <= model.UserNameMaxLength
					}).Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					model.UserNameMinLength,
					model.UserNameMaxLength,
				)),
			),
		),
	})
	if len(errs) > 0 {
		return errs
	}

	return nil
}