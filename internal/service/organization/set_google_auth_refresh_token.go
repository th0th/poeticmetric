package organization

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/model"
)

func SetGoogleOauthRefreshToken(ctx context.Context, id uint, authorizationCode string) error {
	token, err := env.GetGoogleOauthConfig().Exchange(ctx, authorizationCode)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	organization := model.Organization{
		Id:                      id,
		GoogleOauthRefreshToken: &token.RefreshToken,
	}

	err = ic.Postgres(ctx).
		Select("GoogleOauthRefreshToken").
		Where(organization, "Id").
		Updates(organization).
		Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
