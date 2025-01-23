package site

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) CreateOrganizationSite(ctx context.Context, organizationID uint, params *poeticmetric.CreateOrganizationSiteParams) (*poeticmetric.OrganizationSite, error) {
	err := s.validationService.CreateOrganizationSiteParams(ctx, organizationID, params)
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

func (s *service) ListOrganizationSites(ctx context.Context, organizationID uint) ([]*poeticmetric.OrganizationSite, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationSites := []*poeticmetric.OrganizationSite{}
	err := postgres.Model(&poeticmetric.Site{}).Find(&organizationSites, poeticmetric.Site{OrganizationID: organizationID}).Error
	if err != nil {
		return nil, err
	}

	return organizationSites, nil
}

func (s *service) ReadOrganizationSite(ctx context.Context, organizationID uint, siteID uint) (*poeticmetric.OrganizationSite, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationSite := poeticmetric.OrganizationSite{}
	err := postgres.First(&organizationSite, poeticmetric.Site{ID: siteID, OrganizationID: organizationID}, "ID", "OrganizationID").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return nil, errors.Wrap(err, 0)
	}

	return &organizationSite, nil
}
