package site

import (
	"context"

	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Postgres          *gorm.DB
	ValidationService poeticmetric.ValidationService
}

type service struct {
	postgres          *gorm.DB
	validationService poeticmetric.ValidationService
}

func New(params NewParams) poeticmetric.SiteService {
	return &service{
		postgres:          params.Postgres,
		validationService: params.ValidationService,
	}
}

func (s *service) Create(ctx context.Context, organizationID uint, params *poeticmetric.CreateSiteParams) (*poeticmetric.OrganizationSite, error) {
	err := s.validationService.CreateSiteParams(ctx, organizationID, params)
	if err != nil {
		return nil, err
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	site := &poeticmetric.Site{
		Domain:                     *params.Domain,
		GoogleSearchConsoleSiteUrl: params.GoogleSearchConsoleSiteURL,
		IsPublic:                   *params.IsPublic,
		Name:                       *params.Name,
		SafeQueryParameters:        params.SafeQueryParameters,
		OrganizationID:             organizationID,
	}

	err = postgres.Create(site).Error
	if err != nil {
		return nil, err
	}

	return &poeticmetric.OrganizationSite{
		CreatedAt:                  site.CreatedAt,
		Domain:                     site.Domain,
		GoogleSearchConsoleSiteUrl: site.GoogleSearchConsoleSiteUrl,
		HasEvents:                  site.HasEvents,
		ID:                         site.ID,
		IsPublic:                   site.IsPublic,
		Name:                       site.Name,
		SafeQueryParameters:        site.SafeQueryParameters,
		UpdatedAt:                  site.UpdatedAt,
	}, nil
}

func (s *service) List(ctx context.Context, organizationID uint) ([]*poeticmetric.OrganizationSite, error) {
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
