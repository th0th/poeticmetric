package poeticmetric

import (
	"context"
)

type ValidationService interface {
	ServiceWithPostgres

	ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error
	CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) error
	InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) error
	OrganizationDeletionParams(ctx context.Context, params *OrganizationDeletionParams) error
	ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error
	UpdateOrganizationParams(ctx context.Context, params *UpdateOrganizationParams) error
	UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error
	UpdateOrganizationUserParams(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error
}
