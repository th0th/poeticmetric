package site

import (
	"fmt"
	v "github.com/RussellLuo/validating/v3"
	"github.com/lib/pq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

type CreatePayload struct {
	Domain              *string        `json:"domain"`
	Name                *string        `json:"name"`
	SafeQueryParameters pq.StringArray `json:"safeQueryParameters"`
}

func Create(dp *depot.Depot, organizationId uint64, payload *CreatePayload) (*Site, error) {
	err := validateCreatePayload(dp, payload)
	if err != nil {
		return nil, err
	}

	modelSite := &model.Site{
		Domain:              *payload.Domain,
		Name:                *payload.Name,
		OrganizationId:      organizationId,
		SafeQueryParameters: payload.SafeQueryParameters,
	}

	err = dp.Postgres().
		Create(modelSite).
		Error
	if err != nil {
		return nil, err
	}

	return Read(dp, modelSite.Id)
}

func validateCreatePayload(dp *depot.Depot, payload *CreatePayload) error {
	errs := v.Validate(v.Schema{
		v.F("domain", payload.Domain): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.Domain(*t)
			}).Msg("Please provide a valid domain name."),

			v.Is(func(t *string) bool {
				return validator.SiteUniqueDomain(dp, *t, nil)
			}).Msg("This domain is already in use."),
		),

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
