package poeticmetric

import (
	"context"
)

type OrganizationService interface {
	ServiceWithPostgres

	DeleteUnverifiedOrganizations(ctx context.Context) error
}
