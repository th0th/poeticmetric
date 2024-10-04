package env

import (
	"fmt"
	"os"

	env2 "github.com/caarlos0/env/v9"
	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

type env struct {
	vars poeticmetric.EnvServiceVars
}

func New() (poeticmetric.EnvService, error) {
	e := env{}

	err := env2.Parse(&e.vars)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &e, nil
}

func (e *env) ClickhouseDsn() string {
	return fmt.Sprintf(
		"clickhouse://%s:%s@%s:%d/%s",
		e.vars.ClickHouseUser,
		e.vars.ClickHousePassword,
		e.vars.ClickHouseHost,
		e.vars.ClickHousePort,
		e.vars.ClickHouseDatabase,
	)
}

func (e *env) Debug() bool {
	return e.vars.Debug
}

func (e *env) GormConfig() *gorm.Config {
	logLevel := logger.Error

	if e.Vars().DatabaseDebug {
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

func (e *env) IsHosted() bool {
	return e.vars.IsHosted
}

func (e *env) PostgresDsn() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		e.vars.PostgresUser,
		e.vars.PostgresPassword,
		e.vars.PostgresHost,
		e.vars.PostgresPort,
		e.vars.PostgresDatabase,
	)
}

func (e *env) RedisAddr() string {
	return fmt.Sprintf("%s:%d", e.vars.RedisHost, e.vars.RedisPort)
}

func (e *env) SecretKey() string {
	return e.vars.SecretKey
}

func (e *env) Vars() poeticmetric.EnvServiceVars {
	return e.vars
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
