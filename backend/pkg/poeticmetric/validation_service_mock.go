package poeticmetric

import (
	"context"

	"github.com/stretchr/testify/mock"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type ValidationServiceMock struct {
	mock.Mock
}

func (m *ValidationServiceMock) ActivateUserParams(ctx context.Context, params *ActivateUserParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) ChangePlanRequest(ctx context.Context, request *ChangePlanRequest) error {
	return m.Called(ctx, request).Error(0)
}

func (m *ValidationServiceMock) ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) CreateEventParams(ctx context.Context, params *CreateEventParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) error {
	return m.Called(ctx, organizationID, params).Error(0)
}

func (m *ValidationServiceMock) InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) error {
	return m.Called(ctx, organizationID, params).Error(0)
}

func (m *ValidationServiceMock) DeleteOrganizationRequest(ctx context.Context, request *OrganizationDeletionRequest) error {
	return m.Called(ctx, request).Error(0)
}

func (m *ValidationServiceMock) Postgres() *gorm.DB {
	return m.Called().Get(0).(*gorm.DB)
}

func (m *ValidationServiceMock) ResendOrganizationUserInvitationEmailParams(ctx context.Context, organizationID uint, params *ResendOrganizationUserInvitationEmailParams) error {
	return m.Called(ctx, organizationID, params).Error(0)
}

func (m *ValidationServiceMock) ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) SetSiteGoogleOAuthRefreshTokenParams(ctx context.Context, params *SetSiteGoogleOAuthRefreshTokenParams) (*oauth2.Token, error) {
	args := m.Called(ctx, params)

	if token, ok := args.Get(0).(*oauth2.Token); ok {
		return token, args.Error(1)
	}

	return nil, args.Error(1)
}

func (m *ValidationServiceMock) SignUpParams(ctx context.Context, params *SignUpParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) SiteReportFilters(ctx context.Context, organizationID uint, filters *SiteReportFilters) error {
	return m.Called(ctx, organizationID, filters).Error(0)
}

func (m *ValidationServiceMock) UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationRequest(ctx context.Context, params *UpdateOrganizationRequest) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, request *UpdateOrganizationSiteParams) error {
	return m.Called(ctx, organizationID, siteID, request).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationUserParams(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error {
	return m.Called(ctx, organizationID, userID, params).Error(0)
}

func (m *ValidationServiceMock) VerifyUserEmailAddressParams(ctx context.Context, userID uint, params *VerifyUserEmailAddressParams) error {
	return m.Called(ctx, userID, params).Error(0)
}
