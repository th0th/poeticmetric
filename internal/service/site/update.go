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

type UpdateData struct {
	GoogleSearchConsoleSiteUrl string
	IsPublic                   bool
	Name                       string
	SafeQueryParameters        []string
}

func Update(ctx context.Context, id uint, data *UpdateData) (*model.Site, error) {
	site := model.Site{Id: id}

	err := ic.Postgres(ctx).Where(site, "Id").First(&site).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	err = validateUpdateData(ctx, site.OrganizationId, data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	site.IsPublic = data.IsPublic
	site.Name = data.Name
	site.SafeQueryParameters = data.SafeQueryParameters

	return &site, nil
}

func validateUpdateData(ctx context.Context, organizationId uint, data *UpdateData) error {
	errs := v.Validate(v.Schema{
		v.F("GoogleSearchConsoleSiteUrl", data.GoogleSearchConsoleSiteUrl): v.Any(
			v.Zero[string](),

			v.Is[string](func(s string) bool {
				return validator.OrganizationGoogleSearchConsoleSiteUrl(ctx, organizationId, s)
			}).Msg("Site can't be found on Google Search Console."),
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
		return errs
	}

	return nil
}
