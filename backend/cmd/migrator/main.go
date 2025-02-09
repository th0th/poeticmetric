package main

import (
	"os"

	"github.com/go-errors/errors"
	"github.com/rs/zerolog"
	clickhouse2 "gorm.io/driver/clickhouse"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/lib/migration"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
)

func main() {
	envService, err := env.New()
	if err != nil {
		Logger.Panic().Err(errors.Wrap(err, 0)).Msg("failed to init env service")
	}

	postgres, err := gorm.Open(postgres2.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Err(errors.Wrap(err, 0)).Msg("failed to init postgres")
	}

	clickhouse, err := gorm.Open(clickhouse2.Open(envService.ClickHouseDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Err(errors.Wrap(err, 0)).Msg("failed to init clickhouse")
	}

	err = postgres.Transaction(func(postgres2 *gorm.DB) error {
		err2 := migration.Postgres(postgres2, envService.PostgresDatabase())
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = migration.ClickHouse(clickhouse, envService.ClickHouseDatabase())
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		Logger.Panic().Err(errors.Wrap(err, 0)).Msg("failed to run migrations")
	}

	Logger.Info().Msg("migrations are run successfully")
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
