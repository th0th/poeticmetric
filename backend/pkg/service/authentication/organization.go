package authentication

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ReadOrganization(ctx context.Context, organizationID uint) (*poeticmetric.AuthenticationOrganization, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.AuthenticationOrganization{}
	err := postgres.First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return nil, errors.Wrap(err, 0)
	}

	return &organization, nil
}

func (s *service) UpdateOrganization(ctx context.Context, organizationID uint, params *poeticmetric.UpdateOrganizationParams) error {
	err := s.validationService.UpdateOrganizationParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.Organization{ID: organizationID}
	err = postgres.Select("ID").First(&organization, organization, "ID").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	fields := []string{}

	if params.Name != nil {
		organization.Name = *params.Name
		fields = append(fields, "Name")
	}

	err = postgres.Model(&organization).Select(fields).Updates(&organization).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
