package test

import (
	"context"
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/go-errors/errors"
	"github.com/stretchr/testify/require"
	testcontainerspostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/lib/migration"
	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/test/testconfig"
)

var testPostgres = &poeticmetric.TestPostgres{}

func Postgres(t *testing.T) *gorm.DB {
	testPostgres.Once.Do(func() {
		err := preparePostgres(t.Context())
		require.NoError(t, err)
	})

	return testPostgres.DB
}

func preparePostgres(ctx context.Context) error {
	database := "webgazer_test"
	password := "webgazer_test" //nolint:gosec
	user := "webgazer_test"

	container, err := testcontainerspostgres.Run(
		ctx,
		"postgres:16-alpine",
		testcontainerspostgres.WithDatabase(database),
		testcontainerspostgres.WithPassword(password),
		testcontainerspostgres.WithUsername(user),
		testcontainerspostgres.BasicWaitStrategies(),
	)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	host, err := container.Host(ctx)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	mappedPort, err := container.MappedPort(ctx, "5432")
	if err != nil {
		return errors.Wrap(err, 0)
	}

	logLevel := logger.Error

	if testconfig.Debug() {
		logLevel = logger.Info
	}

	postgres, err := gorm.Open(
		gormpostgres.Open(
			fmt.Sprintf(
				"postgres://%s:%s@%s:%s/%s?sslmode=disable",
				user,
				password,
				host,
				mappedPort.Port(),
				database,
			),
		),
		&gorm.Config{
			Logger: logger.New(
				log.New(os.Stdout, "\r\n", log.LstdFlags),
				logger.Config{
					LogLevel:                  logLevel,
					IgnoreRecordNotFoundError: true,
					Colorful:                  true,
				},
			),
		},
	)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = migration.Postgres(postgres, database)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	testPostgres.Container = container
	testPostgres.DB = postgres

	return nil
}
