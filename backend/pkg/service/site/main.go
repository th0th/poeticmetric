package site

import (
	"context"

	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Postgres *gorm.DB
}

type service struct {
	postgres *gorm.DB
}

func New(params NewParams) poeticmetric.SiteService {
	return &service{
		postgres: params.Postgres,
	}
}

func (s *service) ListOrganizationSites(ctx context.Context, organizationID uint) ([]*poeticmetric.OrganizationSite, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationSites := []*poeticmetric.OrganizationSite{}
	err := postgres.Model(&poeticmetric.Site{}).Find(&organizationSites, poeticmetric.Site{OrganizationID: organizationID}).Error
	if err != nil {
		return nil, err
	}

	return organizationSites, nil
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}
