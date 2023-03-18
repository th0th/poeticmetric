package validator

import (
	"context"

	"github.com/go-errors/errors"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"
)

func GoogleSearchConsoleSiteUrl(dp *depot.Depot, organizationId uint64, v string) bool {
	ctx := context.Background()

	modelOrganization := &model.Organization{}

	err := dp.Postgres().
		Model(&model.Organization{}).
		Select("google_oauth_refresh_token").
		Where("id = ?", organizationId).
		First(modelOrganization).
		Error
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	service, err := searchconsole.NewService(
		ctx,
		option.WithTokenSource(env.GetGoogleOauthConfig().TokenSource(ctx, &oauth2.Token{
			RefreshToken: *modelOrganization.GoogleOauthRefreshToken,
		})),
	)
	if err != nil {
		return false
	}

	sitesGetCall, err := service.Sites.Get(v).Do()
	if err != nil || sitesGetCall.SiteUrl != v {
		return false
	}

	return true
}
