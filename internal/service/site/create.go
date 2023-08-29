package site

import (
	"context"
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
	"github.com/th0th/poeticmetric/internal/validator"
)

type CreateData struct {
	Domain                     string
	GoogleSearchConsoleSiteUrl *string
	IsPublic                   bool
	Name                       string
	SafeQueryParameters        []string
}

func Create(ctx context.Context, organizationId uint, data *CreateData) (*model.Site, error) {
	err := validateCreateData(ctx, data)
	if err != nil {
		fmt.Println(errors.As(err, &v.Errors{}))
		fmt.Println(errors.Is(err, &v.Errors{}))
		return nil, errors.Wrap(err, 0)
	}

	site := model.Site{
		Domain:                     data.Domain,
		GoogleSearchConsoleSiteUrl: nil,
		IsPublic:                   data.IsPublic,
		Name:                       data.Name,
		OrganizationId:             organizationId,
		SafeQueryParameters:        data.SafeQueryParameters,
	}

	if site.SafeQueryParameters == nil {
		site.SafeQueryParameters = []string{}
	}

	err = ic.Postgres(ctx).Create(&site).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &site, nil
}

func validateCreateData(ctx context.Context, data *CreateData) error {
	errs := v.Validate(v.Schema{
		v.F("Domain", data.Domain): v.All(
			v.Nonzero[string]().Msg("This field is required."),

			v.Is[string](validator.Domain).Msg("Please provide a valid domain name."),

			v.Is[string](func(s string) bool {
				return validator.SiteUniqueDomain(ctx, s, nil)
			}).Msg("This domain is already in use."),
		),

		v.F("Name", data.Name): v.All(
			v.Nonzero[string]().Msg("This field is required."),

			v.LenString(model.SiteNameMinLength, model.SiteNameMaxLength).
				Msg(fmt.Sprintf(
					"This field should be between %d and %d characters in length.",
					model.SiteNameMinLength,
					model.SiteNameMaxLength,
				)),
		),
	})
	if len(errs) > 0 {
		return errors.Wrap(errs, 0)
	}

	return nil
}
