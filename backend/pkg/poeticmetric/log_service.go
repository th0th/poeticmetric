package poeticmetric

import (
	"context"
)

type LogService interface {
	ServiceWithPostgres

	CreateUnverifiedOrganizationsDeletionLog(ctx context.Context, params *LogUnverifiedOrganizationsDeletionData) error
}
