package poeticmetric

import (
	"net/smtp"

	"github.com/stretchr/testify/mock"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type EnvServiceMock struct {
	mock.Mock
}

func (s *EnvServiceMock) ClickhouseDatabase() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) ClickhouseDsn() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) Debug() bool {
	return s.Called().Bool(0)
}

func (s *EnvServiceMock) FrontendUrl(path string) string {
	return s.Called(path).String(0)
}

func (s *EnvServiceMock) GoogleOAuthConfig() (*oauth2.Config, error) {
	args := s.Called()
	return args.Get(0).(*oauth2.Config), args.Error(1)
}

func (s *EnvServiceMock) GormConfig() *gorm.Config {
	return s.Called().Get(0).(*gorm.Config)
}

func (s *EnvServiceMock) IsHosted() bool {
	return s.Called().Bool(0)
}

func (s *EnvServiceMock) PostgresDatabase() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) PostgresDsn() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) RestApiBasePath() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) SmtpAddr() string {
	return s.Called().String(0)
}

func (s *EnvServiceMock) SmtpAuth() smtp.Auth {
	return s.Called().Get(0).(smtp.Auth)
}

func (s *EnvServiceMock) SmtpFrom() string {
	return s.Called().String(0)
}
