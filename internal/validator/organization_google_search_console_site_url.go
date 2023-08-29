package validator

import (
	"context"

	"github.com/go-errors/errors"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/model"
)

func OrganizationGoogleSearchConsoleSiteUrl(ctx context.Context, organizationId uint, siteUrl string) bool {
	organization := model.Organization{
		Id: organizationId,
	}

	err := ic.Postgres(ctx).
		Select("google_oauth_refresh_token").
		Where(organization, "Id").
		First(&organization).
		Error
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	service, err := searchconsole.NewService(
		ctx,
		option.WithTokenSource(env.GetGoogleOauthConfig().TokenSource(ctx, &oauth2.Token{
			RefreshToken: *organization.GoogleOauthRefreshToken,
		})),
	)
	if err != nil {
		return false
	}

	sitesGetCall, err := service.Sites.Get(siteUrl).Do()
	if err != nil || sitesGetCall.SiteUrl != siteUrl {
		return false
	}

	return true
}
