package env

import (
	"fmt"
	"os"

	"github.com/ClickHouse/clickhouse-go/v2"
	env2 "github.com/caarlos0/env/v9"
	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

type service struct {
	vars poeticmetric.EnvServiceVars
}

func New() (poeticmetric.EnvService, error) {
	e := service{}

	err := env2.Parse(&e.vars)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &e, nil
}

func (s *service) ClickhouseAddress() string {
	return fmt.Sprintf("%s:%d", s.vars.ClickHouseHost, s.vars.ClickHousePort)
}

func (s *service) ClickhouseAuth() clickhouse.Auth {
	return clickhouse.Auth{
		Database: s.vars.ClickHouseDatabase,
		Username: s.vars.ClickHouseUser,
		Password: s.vars.ClickHousePassword,
	}
}

func (s *service) ClickhouseDatabase() string {
	return s.vars.ClickHouseDatabase
}

func (s *service) ClickhouseDsn() string {
	return fmt.Sprintf(
		"clickhouse://%s:%s@%s:%d/%s",
		s.vars.ClickHouseUser,
		s.vars.ClickHousePassword,
		s.vars.ClickHouseHost,
		s.vars.ClickHousePort,
		s.vars.ClickHouseDatabase,
	)
}

func (s *service) Debug() bool {
	return s.vars.Debug
}

func (s *service) GormConfig() *gorm.Config {
	logLevel := logger.Error

	if s.Vars().DatabaseDebug {
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

func (s *service) SecretKey() string {
	return s.vars.SecretKey
}

func (s *service) Vars() poeticmetric.EnvServiceVars {
	return s.vars
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
