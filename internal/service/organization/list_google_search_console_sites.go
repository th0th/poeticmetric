package organization

import (
	"context"
	"encoding/json"
	"net/url"

	"github.com/go-errors/errors"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/model"
)

type GoogleSearchConsoleSite struct {
	Url string `json:"siteUrl"`
}

func ListGoogleSearchConsoleSites(ctx context.Context, organizationId uint) ([]*GoogleSearchConsoleSite, error) {
	modelOrganization := &model.Organization{}

	err := ic.Postgres(ctx).
		Model(&model.Organization{}).
		Select("google_oauth_refresh_token").
		Where("id = ?", organizationId).
		First(modelOrganization).
		Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	service, err := searchconsole.NewService(
		ctx,
		option.WithTokenSource(env.GetGoogleOauthConfig().TokenSource(ctx, &oauth2.Token{
			RefreshToken: *modelOrganization.GoogleOauthRefreshToken,
		})),
	)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	res, err := service.Sites.List().Do()
	if err != nil {
		urlError, isOk := err.(*url.Error)
		if isOk {
			oauth2RetrieveError, isOk2 := urlError.Err.(*oauth2.RetrieveError)
			if isOk2 {
				var response map[string]any

				err2 := json.Unmarshal(oauth2RetrieveError.Body, &response)
				if err2 != nil {
					return nil, errors.Wrap(err2, 0)
				}

				if response["error_description"] == "Token has been expired or revoked." {
					_, err3 := ClearGoogleAuth(ctx, organizationId)
					if err3 != nil {
						return nil, err3
					}

					// TODO: fix
					return nil, nil
				}
			}
		}

		return nil, errors.Wrap(err, 0)
	}

	sites := []*GoogleSearchConsoleSite{}

	for _, s := range res.SiteEntry {
		sites = append(sites, &GoogleSearchConsoleSite{Url: s.SiteUrl})
	}

	return sites, nil
}
