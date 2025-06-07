package site

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ReadPublicSite(ctx context.Context, siteDomain string) (*poeticmetric.PublicSiteResponse, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	publicSite := poeticmetric.PublicSiteResponse{}
	err := postgres.First(&publicSite, poeticmetric.Site{Domain: siteDomain, IsPublic: true}, "Domain", "IsPublic").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return nil, errors.Wrap(err, 0)
	}

	return &publicSite, nil
}
