package poeticmetric

import (
	"context"

	"github.com/stretchr/testify/mock"
	"gorm.io/gorm"
)

type MockValidationService struct {
	mock.Mock
}

func (m *MockValidationService) Postgres() *gorm.DB {
	return m.Called().Get(0).(*gorm.DB)
}

func (m *MockValidationService) AuthenticationResetUserPasswordParams(ctx context.Context, params *AuthenticationResetUserPasswordParams) error {
	return m.Called(ctx, params).Error(0)
}

func (m *MockValidationService) AuthenticationSendUserPasswordRecoveryEmailParams(ctx context.Context, params *AuthenticationSendUserPasswordRecoveryEmailParams) error {
	return m.Called(ctx, params).Error(0)
}
