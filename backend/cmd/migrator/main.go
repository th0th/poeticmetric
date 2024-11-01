package main

import (
	clickhouse2 "gorm.io/driver/clickhouse"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/cmd"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
	"github.com/th0th/poeticmetric/backend/pkg/service/migration"
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

	migrationService := migration.New(migration.NewParams{
		Clickhouse: clickhouse,
		EnvService: envService,
		Postgres:   postgres,
	})

	err = migrationService.Run()
	if err != nil {
		cmd.LogPanic(err, "failed to run migrator")
	}

	cmd.Logger.Info().Msg("migrations are run successfully")
}
