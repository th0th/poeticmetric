package organization

import (
	"context"
	"time"

	"github.com/go-errors/errors"
	"github.com/stripe/stripe-go/v82/customer"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) DeleteOrganization(ctx context.Context, organizationID uint, request *poeticmetric.OrganizationDeletionRequest) error {
	err := s.validationService.DeleteOrganizationRequest(ctx, request)
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
		Reason:                       *request.Reason,
		Detail:                       request.Detail,
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
