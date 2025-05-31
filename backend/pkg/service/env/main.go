package env

import (
	"fmt"
	"net/mail"
	"net/smtp"
	"os"

	"github.com/caarlos0/env/v11"
	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/searchconsole/v1"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type service struct {
	vars poeticmetric.EnvServiceVars
}

func New() (poeticmetric.EnvService, error) {
	e := service{}

	err := env.Parse(&e.vars)
	if err != nil {
		return nil, err
	}

	return &e, nil
}

func (s *service) ClickHouseDatabase() string {
	return s.vars.ClickhouseDatabase
}

func (s *service) ClickHouseDsn() string {
	return fmt.Sprintf(
		"clickhouse://%s:%s@%s:%d/%s",
		s.vars.ClickhouseUser,
		s.vars.ClickhousePassword,
		s.vars.ClickhouseHost,
		s.vars.ClickhousePort,
		s.vars.ClickhouseDatabase,
	)
}

func (s *service) DatabaseDebug() bool {
	return s.vars.DatabaseDebug
}

func (s *service) Debug() bool {
	return s.vars.Debug
}

func (s *service) GoogleOAuthConfig() (*oauth2.Config, error) {
	if s.vars.GoogleClientID == nil || s.vars.GoogleClientSecret == nil {
		return nil, errors.Wrap(poeticmetric.ErrGoogleOAuthConfigMissing, 0)
	}

	return &oauth2.Config{
		ClientID:     *s.vars.GoogleClientID,
		ClientSecret: *s.vars.GoogleClientSecret,
		Endpoint:     google.Endpoint,
		RedirectURL:  s.FrontendURL(""),
		Scopes:       []string{searchconsole.WebmastersReadonlyScope},
	}, nil
}

func (s *service) GormConfig() *gorm.Config {
	logLevel := logger.Error

	if s.DatabaseDebug() {
		logLevel = logger.Info
	}

	return &gorm.Config{
		Logger: logger.New(
			&Logger,
			logger.Config{
				LogLevel:                  logLevel,
				IgnoreRecordNotFoundError: true,
				Colorful:                  true,
			},
		),
	}
}

func (s *service) IsHosted() bool {
	return s.vars.IsHosted
}

func (s *service) PostgresDatabase() string {
	return s.vars.PostgresDatabase
}

func (s *service) PostgresDsn() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		s.vars.PostgresUser,
		s.vars.PostgresPassword,
		s.vars.PostgresHost,
		s.vars.PostgresPort,
		s.vars.PostgresDatabase,
	)
}

func (s *service) RESTApiBasePath() *string {
	return s.vars.RESTApiBasePath
}

func (s *service) SmtpAddr() string {
	return fmt.Sprintf("%s:%s", s.vars.SmtpHost, s.vars.SmtpPort)
}

func (s *service) SmtpAuth() smtp.Auth {
	if s.vars.SmtpUser == "" || s.vars.SmtpPassword == "" {
		return nil
	}

	return smtp.PlainAuth("", s.vars.SmtpUser, s.vars.SmtpPassword, s.vars.SmtpHost)
}

func (s *service) SmtpFrom() *mail.Address {
	return &mail.Address{
		Name:    "PoeticMetric",
		Address: s.vars.SmtpFromAddress,
	}
}

func (s *service) UnverifiedOrganizationDeletionDays() *int {
	return s.vars.UnverifiedOrganizationDeletionDays
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
