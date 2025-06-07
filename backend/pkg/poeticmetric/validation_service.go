package poeticmetric

import (
	"context"

	"golang.org/x/oauth2"
)

type ValidationService interface {
	ServiceWithPostgres

	ActivateUserParams(ctx context.Context, params *ActivateUserParams) error
	ChangePlanRequest(ctx context.Context, request *ChangePlanRequest) error
	ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error
	CreateEventParams(ctx context.Context, params *CreateEventParams) error
	CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) error
	DeleteOrganizationRequest(ctx context.Context, params *OrganizationDeletionRequest) error
	InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) error
	ResendOrganizationUserInvitationEmailParams(ctx context.Context, organizationID uint, params *ResendOrganizationUserInvitationEmailParams) error
	ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error
	SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error
	SetSiteGoogleOAuthRefreshTokenParams(ctx context.Context, params *SetSiteGoogleOAuthRefreshTokenParams) (*oauth2.Token, error)
	SignUpParams(ctx context.Context, params *SignUpParams) error
	SiteReportFilters(ctx context.Context, organizationID *uint, filters *SiteReportFilters) error
	UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error
	UpdateOrganizationRequest(ctx context.Context, request *UpdateOrganizationRequest) error
	UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error
	UpdateOrganizationUserParams(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error
	VerifyUserEmailAddressParams(ctx context.Context, userID uint, params *VerifyUserEmailAddressParams) error
}
