package poeticmetric

import (
	"context"
)

type ValidationService interface {
	ServiceWithPostgres

	ActivateUserParams(ctx context.Context, params *ActivateUserParams) error
	ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error
	CreateEventParams(ctx context.Context, params *CreateEventParams) error
	CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) error
	InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) error
	OrganizationDeletionParams(ctx context.Context, params *OrganizationDeletionParams) error
	ResendOrganizationUserInvitationEmailParams(ctx context.Context, organizationID uint, params *ResendOrganizationUserInvitationEmailParams) error
	ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	SignUpParams(ctx context.Context, params *SignUpParams) error
	SiteReportFilters(ctx context.Context, organizationID uint, filters *SiteReportFilters) error
	UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error
	UpdateOrganizationParams(ctx context.Context, params *UpdateOrganizationParams) error
	UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error
	UpdateOrganizationUserParams(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error
}
