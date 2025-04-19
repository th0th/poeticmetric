package authentication

import (
	"context"
	"time"

	"github.com/go-errors/errors"
	"github.com/stripe/stripe-go/v79/customer"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) DeleteOrganization(ctx context.Context, organizationID uint, params *poeticmetric.OrganizationDeletionParams) error {
	err := s.validationService.OrganizationDeletionParams(ctx, params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	user := poeticmetric.User{IsOrganizationOwner: true, OrganizationID: organizationID}

	err = postgres.Joins("Organization").Joins("Organization.Plan").First(&user, user, "OrganizationID", "Role").Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	organizationDeletion := poeticmetric.OrganizationDeletion{
		DateTime:                     time.Now(),
		OrganizationCreatedAt:        user.Organization.CreatedAt,
		OrganizationID:               organizationID,
		OrganizationName:             user.Organization.Name,
		OrganizationPlanName:         user.Organization.Plan.Name,
		OrganizationStripeCustomerID: user.Organization.StripeCustomerID,
		UserID:                       user.ID,
		UserName:                     user.Name,
		UserEmail:                    user.Email,
		Reason:                       *params.Reason,
		Detail:                       params.Detail,
	}

	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx context.Context) error {
		postgres2 := poeticmetric.ServicePostgres(ctx, s)

		// create organization deletion
		err2 := postgres2.Create(&organizationDeletion).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		// delete organization
		err2 = postgres2.Delete(&poeticmetric.Organization{ID: organizationID}).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		// delete stripe customer if exists
		if user.Organization.StripeCustomerID != nil {
			_, err2 = customer.Del(*user.Organization.StripeCustomerID, nil)
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}
		}

		return nil
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) ListOrganizationDeletionReasons(ctx context.Context) ([]*poeticmetric.OrganizationDeletionReason, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organizationDeletionReasons := []*poeticmetric.OrganizationDeletionReason{}
	err := postgres.Order(`"order"`).Find(&organizationDeletionReasons).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return organizationDeletionReasons, nil
}

func (s *service) ReadOrganization(ctx context.Context, organizationID uint) (*poeticmetric.AuthenticationOrganization, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	organization := poeticmetric.AuthenticationOrganization{}
	err := postgres.Joins("Plan").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
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
