package site

import (
	"context"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/model"
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
		return nil, err
	}

	service, err := searchconsole.NewService(
		ctx,
		option.WithTokenSource(env.GetGoogleOauthConfig().TokenSource(ctx, &oauth2.Token{
			RefreshToken: *modelOrganization.GoogleOauthRefreshToken,
		})),
	)
	if err != nil {
		return nil, err
	}

	res, err := service.Sites.List().Do()
	if err != nil {
		return nil, err
	}

	sites := []*GoogleSearchConsoleSite{}

	for _, s := range res.SiteEntry {
		sites = append(sites, &GoogleSearchConsoleSite{SiteUrl: s.SiteUrl})
	}

	return sites, nil
}
