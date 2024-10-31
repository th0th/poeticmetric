package env

import (
	"fmt"
	"os"

	env2 "github.com/caarlos0/env/v11"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/analytics"
)

type service struct {
	vars analytics.EnvServiceVars
}

func New() (analytics.EnvService, error) {
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

func (s *service) RestApiBasePath() string {
	return "/api"
}

func (s *service) Debug() bool {
	return s.vars.Debug
}

func (s *service) IsHosted() bool {
	return s.vars.IsHosted
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
