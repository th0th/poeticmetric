package site

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/lib/pq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

type UpdatePayload struct {
	Name                *string        `json:"name"`
	SafeQueryParameters pq.StringArray `json:"safeQueryParameters" gorm:"type:text[]"`
}

func Update(dp *depot.Depot, id uint64, payload *UpdatePayload) (*Site, error) {
	err := validateUpdatePayload(payload)
	if err != nil {
		return nil, err
	}

	update := &model.Site{}
	updateFields := []string{}

	if payload.Name != nil {
		update.Name = *payload.Name
		updateFields = append(updateFields, "name")
	}

	if payload.SafeQueryParameters != nil {
		update.SafeQueryParameters = payload.SafeQueryParameters
		updateFields = append(updateFields, "safe_query_parameters")
	}

	err = dp.Postgres().
		Where("id = ?", id).
		Select(updateFields).
		Updates(&update).
		Error
	if err != nil {
		return nil, err
	}

	return Read(dp, id)
}

func validateUpdatePayload(payload *UpdatePayload) error {
	errs := v.Validate(v.Schema{
		v.F("name", payload.Name): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return len(*t) >= model.SiteNameMinLength && len(*t) <= model.SiteNameMaxLength
			}).Msg(fmt.Sprintf(
				"This field should be between %d and %d characters in length.",
				model.SiteNameMinLength,
				model.SiteNameMaxLength,
			)),
		),
	})
	if len(errs) > 0 {
		return errs
	}

	return nil
}
