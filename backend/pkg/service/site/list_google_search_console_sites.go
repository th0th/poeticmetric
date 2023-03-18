package site

import (
	"context"
	"encoding/json"
	"net/url"

	"github.com/go-errors/errors"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"
)

type GoogleSearchConsoleSite struct {
	SiteUrl string `json:"siteUrl"`
}

func ListGoogleSearchConsoleSites(dp *depot.Depot, organizationId uint64) ([]*GoogleSearchConsoleSite, error) {
	ctx := context.Background()

	modelOrganization := &model.Organization{}

	err := dp.Postgres().
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
					_, err3 := organization.ClearGoogleAuth(dp, organizationId)
					if err3 != nil {
						return nil, err3
					}

					return nil, ErrInvalidGoogleOauthToken
				}
			}
		}

		return nil, errors.Wrap(err, 0)
	}

	sites := []*GoogleSearchConsoleSite{}

	for _, s := range res.SiteEntry {
		sites = append(sites, &GoogleSearchConsoleSite{SiteUrl: s.SiteUrl})
	}

	return sites, nil
}
