package organization

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func ClearGoogleAuth(ctx context.Context, organizationId uint) (*model.Organization, error) {
	organization := model.Organization{Id: organizationId}
	organizationUpdate := model.Organization{GoogleOauthRefreshToken: nil}
	siteFilter := model.Site{OrganizationId: organizationId}
	siteFilter2 := model.Site{GoogleSearchConsoleSiteUrl: nil}
	siteUpdate := model.Site{GoogleSearchConsoleSiteUrl: nil}

	err := ic.PostgresTransaction(ctx, func(ctx2 context.Context) error {
		err2 := ic.Postgres(ctx2).
			Select("GoogleSearchConsoleSiteUrl").
			Where(siteFilter, "OrganizationId").
			Not(siteFilter2, "GoogleSearchConsoleSiteUrl").
			Updates(siteUpdate).
			Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = ic.Postgres(ctx2).
			Select("GoogleOauthRefreshToken").
			Where(organization, "Id").
			Updates(organizationUpdate).
			Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return nil, nil
}
