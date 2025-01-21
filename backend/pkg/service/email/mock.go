package email

import (
	"github.com/stretchr/testify/mock"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type MockService struct {
	mock.Mock
}

func (m *MockService) Send(params poeticmetric.SendEmailParams) error {
	args := m.Called(params)

	return args.Error(0)
}
