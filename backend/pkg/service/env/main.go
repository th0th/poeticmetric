package env

import (
	"fmt"
	"net/smtp"
	"os"

	env2 "github.com/caarlos0/env/v11"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type service struct {
	vars poeticmetric.EnvServiceVars
}

func New() (poeticmetric.EnvService, error) {
	e := service{}

	err := env2.Parse(&e.vars)
	if err != nil {
		return nil, err
	}

	return &e, nil
}

func (s *service) ClickhouseDatabase() string {
	return s.vars.ClickhouseDatabase
}

func (s *service) ClickhouseDsn() string {
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

func (s *service) FrontendUrl(path string) string {
	return fmt.Sprintf("%s%s", s.vars.FrontendBaseUrl, path)
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

func (s *service) RedisAddr() string {
	return fmt.Sprintf("%s:%d", s.vars.RedisHost, s.vars.RedisPort)
}

func (s *service) RedisPassword() string {
	return s.vars.RedisPassword
}

func (s *service) RestApiBasePath() string {
	return "/api"
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

func (s *service) SmtpFrom() string {
	return fmt.Sprintf("PoeticMetric <%s>", s.vars.SmtpFromAddress)
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
