package migrator

import (
	"github.com/go-errors/errors"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/pkg/service/env"
	"github.com/th0th/poeticmetric/pkg/service/migration"

	"github.com/th0th/poeticmetric/cmd"
)

func main() {
	envService, err := env.New()
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to init env service")
	}

	postgres, err := gorm.Open(postgres2.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to init postgres")
	}

	migrator := migration.New(&migration.NewParams{
		EnvService: envService,
		Postgres:   postgres,
	})

	err = migrator.Run()
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to run migrator")
	}

	cmd.Logger.Info().Msg("migration are run successfully")
}
