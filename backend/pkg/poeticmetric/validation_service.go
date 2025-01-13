package poeticmetric

import (
	"context"
)

type ValidationService interface {
	ServiceWithPostgres

	ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error
	CreateSiteParams(ctx context.Context, organizationID uint, params *CreateSiteParams) error
	ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error
	UpdateOrganizationParams(ctx context.Context, params *UpdateOrganizationParams) error
}
