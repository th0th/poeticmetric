package main

import (
	clickhouse2 "github.com/ClickHouse/clickhouse-go/v2"
	"github.com/jmoiron/sqlx"

	"github.com/th0th/poeticmetric/pkg/service/env"
	"github.com/th0th/poeticmetric/pkg/service/migration"

	"github.com/th0th/poeticmetric/cmd"
)

func main() {
	envService, err := env.New()
	if err != nil {
		cmd.LogPanic(err, "failed to init env service")
	}

	postgres, err := sqlx.Connect("postgres", envService.PostgresDsn())
	if err != nil {
		cmd.Logger.Panic().Stack().Err(err).Msg("failed to connect to postgres")
	}

	clickhouse := clickhouse2.OpenDB(&clickhouse2.Options{
		Addr: []string{envService.ClickhouseAddress()},
		Auth: envService.ClickhouseAuth(),
	})
	if err != nil {
		cmd.Logger.Panic().Stack().Err(err).Msg("failed to connect to clickhouse")
	}

	migrator := migration.New(&migration.NewParams{
		Clickhouse: clickhouse,
		EnvService: envService,
		Postgres:   postgres.DB,
	})

	err = migrator.Run()
	if err != nil {
		cmd.LogPanic(err, "failed to run migrator")
	}

	cmd.Logger.Info().Msg("migrations are run successfully")
}
