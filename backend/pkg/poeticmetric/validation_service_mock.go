package poeticmetric

import (
	"context"

	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

type ValidationServiceMock struct {
	mock.Mock
}

func (m *ValidationServiceMock) ChangeUserPasswordParams(ctx context.Context, params *ChangeUserPasswordParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) CreateOrganizationSiteParams(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) error {
	return m.Called(ctx, organizationID, params).Error(0)
}

func (m *ValidationServiceMock) InviteOrganizationUserParams(ctx context.Context, organizationID uint, params *InviteOrganizationUserParams) error {
	return m.Called(ctx, organizationID, params).Error(0)
}

func (m *ValidationServiceMock) OrganizationDeletionParams(ctx context.Context, params *OrganizationDeletionParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) Postgres() *gorm.DB {
	return m.Called().Get(0).(*gorm.DB)
}

func (m *ValidationServiceMock) ResetUserPasswordParams(ctx context.Context, params *ResetUserPasswordParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) SendUserPasswordRecoveryEmailParams(ctx context.Context, params *SendUserPasswordRecoveryEmailParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) UpdateAuthenticationUserParams(ctx context.Context, params *UpdateAuthenticationUserParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationParams(ctx context.Context, params *UpdateOrganizationParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationSiteParams(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error {
	return m.Called(ctx, organizationID, siteID, params).Error(0)
}

func (m *ValidationServiceMock) UpdateOrganizationUserParams(ctx context.Context, organizationID uint, userID uint, params *UpdateOrganizationUserParams) error {
	return m.Called(ctx, organizationID, userID, params).Error(0)
}
