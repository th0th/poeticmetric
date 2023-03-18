package site

import (
	"fmt"

	v "github.com/RussellLuo/validating/v3"
	"github.com/lib/pq"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/utils"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

type UpdatePayload struct {
	GoogleSearchConsoleSiteUrl utils.Optional[string] `json:"googleSearchConsoleSiteUrl"`
	IsPublic                   *bool                  `json:"isPublic"`
	Name                       *string                `json:"name"`
	SafeQueryParameters        pq.StringArray         `gorm:"type:text[]" json:"safeQueryParameters"`
}

func Update(dp *depot.Depot, id uint64, payload *UpdatePayload) (*Site, error) {
	modelSite := &model.Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Select("organization_id").
		Where("id = ?", id).
		First(modelSite).
		Error
	if err != nil {
		return nil, err
	}

	err = validateUpdatePayload(dp, modelSite.OrganizationId, payload)
	if err != nil {
		return nil, err
	}

	update := &model.Site{}
	updateFields := []string{}

	if payload.GoogleSearchConsoleSiteUrl.Defined {
		update.GoogleSearchConsoleSiteUrl = payload.GoogleSearchConsoleSiteUrl.Value
		updateFields = append(updateFields, "google_search_console_site_url")
	}

	if payload.IsPublic != nil {
		update.IsPublic = *payload.IsPublic
		updateFields = append(updateFields, "is_public")
	}

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

func validateUpdatePayload(dp *depot.Depot, organizationId uint64, payload *UpdatePayload) error {
	errs := v.Validate(v.Schema{
		v.F("googleSearchConsoleSiteUrl", payload.GoogleSearchConsoleSiteUrl): v.Any(
			v.Zero[utils.Optional[string]](),

			v.Is(func(t utils.Optional[string]) bool {
				return t.Defined && t.Value == nil
			}),

			v.All(
				v.Is(func(t utils.Optional[string]) bool {
					return len(*t.Value) > 1
				}).Msg("This field can't be empty."),

				v.Is(func(t utils.Optional[string]) bool {
					return validator.GoogleSearchConsoleSiteUrl(dp, organizationId, *t.Value)
				}).Msg("Site can't be found on Google Search Console."),
			),
		),

		v.F("name", payload.Name): v.Any(
			v.Zero[*string](),

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
