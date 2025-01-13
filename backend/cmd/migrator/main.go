package main

import (
	"fmt"

	clickhouse2 "gorm.io/driver/clickhouse"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/cmd"
	"github.com/th0th/poeticmetric/backend/pkg/lib/migration"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
)

func main() {
	envService, err := env.New()
	if err != nil {
		cmd.LogPanic(err, "failed to init env service")
	}

	postgres, err := gorm.Open(postgres2.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init postgres")
	}

	clickhouse, err := gorm.Open(clickhouse2.Open(envService.ClickhouseDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init clickhouse")
	}

	err = postgres.Transaction(func(postgres2 *gorm.DB) error {
		err2 := migration.Postgres(postgres2, envService.PostgresDatabase())
		if err2 != nil {
			return fmt.Errorf("failed to run postgres migrations: %w", err2)
		}

		err2 = migration.ClickHouse(clickhouse, envService.ClickhouseDatabase())
		if err2 != nil {
			return fmt.Errorf("failed to run clickhouse migrations: %w", err2)
		}

		return nil
	})
	if err != nil {
		cmd.LogPanic(err, "failed to run migrations: %w")
	}

	cmd.Logger.Info().Msg("migrations are run successfully")
}
