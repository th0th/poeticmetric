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

func (s *service) DeleteOrganizationSite(ctx context.Context, organizationID uint, siteID uint) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	q := postgres.Where(poeticmetric.Site{ID: siteID, OrganizationID: organizationID}).Delete(&poeticmetric.Site{})
	if q.Error != nil {
		return errors.Wrap(q.Error, 0)
	}
	if q.RowsAffected != 1 {
		return errors.Wrap(poeticmetric.ErrNotFound, 0)
	}

	return nil
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

func (s *service) UpdateOrganizationSite(ctx context.Context, organizationID uint, siteID uint, params *poeticmetric.UpdateOrganizationSiteParams) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	err := s.validationService.UpdateOrganizationSiteParams(ctx, organizationID, siteID, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	update := poeticmetric.Site{}
	var fields []string

	if params.Domain != nil {
		update.Domain = *params.Domain
		fields = append(fields, "Domain")
	}

	if params.GoogleSearchConsoleSiteURL != nil {
		update.GoogleSearchConsoleSiteUrl = params.GoogleSearchConsoleSiteURL
		fields = append(fields, "GoogleSearchConsoleSiteUrl")
	}

	if params.IsPublic != nil {
		update.IsPublic = *params.IsPublic
		fields = append(fields, "IsPublic")
	}

	if params.Name != nil {
		update.Name = *params.Name
		fields = append(fields, "Name")
	}

	if params.SafeQueryParameters != nil {
		update.SafeQueryParameters = params.SafeQueryParameters
		fields = append(fields, "SafeQueryParameters")
	}

	err = postgres.
		Model(&poeticmetric.Site{}).
		Select(fields).
		Where(poeticmetric.Site{ID: siteID, OrganizationID: organizationID}, "ID", "OrganizationID").
		Updates(update).
		Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
