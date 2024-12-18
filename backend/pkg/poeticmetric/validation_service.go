package poeticmetric

import (
	"context"
)

type ValidationService interface {
	ServiceWithPostgres

	CreateSiteParams(ctx context.Context, organizationID uint, params *CreateSiteParams) error
	ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
}
