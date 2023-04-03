package organization

import (
	"context"
	"log"

	v "github.com/RussellLuo/validating/v3"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

type SetGoogleOauthTokenPayload struct {
	Code *string `json:"code"`
}

func SetGoogleOauthToken(dp *depot.Depot, id uint64, payload *SetGoogleOauthTokenPayload) error {
	modelOrganization := &model.Organization{}

	err := validateSetGoogleOauthTokenPayload(modelOrganization, payload)
	if err != nil {
		return err
	}

	err = dp.Postgres().
		Model(&model.Organization{}).
		Select("google_oauth_refresh_token").
		Where("id = ?", id).
		Updates(modelOrganization).
		Error
	if err != nil {
		return err
	}

	return nil
}

func validateSetGoogleOauthTokenPayload(modelOrganization *model.Organization, payload *SetGoogleOauthTokenPayload) error {
	errs := v.Validate(v.Schema{
		v.F("code", payload.Code): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				ctx := context.Background()

				token, err := env.GetGoogleOauthConfig().Exchange(ctx, *payload.Code)
				if err != nil {
					log.Println(err)
					return false
				}

				modelOrganization.GoogleOauthRefreshToken = &token.RefreshToken

				return true
			}).Msg("Couldn't authenticate with Google. Please try again."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
