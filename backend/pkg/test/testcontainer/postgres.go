package testcontainer

import (
	"context"
	"fmt"
	"log"
	"os"
	"testing"

	"github.com/go-errors/errors"
	"github.com/testcontainers/testcontainers-go"
	testcontainerspostgres "github.com/testcontainers/testcontainers-go/modules/postgres"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/lib/migration"
	"github.com/th0th/poeticmetric/backend/pkg/test/config"
)

func NewPostgres(t *testing.T, ctx context.Context) (testcontainers.Container, *gorm.DB) {
	database := "poeticmetric_test"
	password := "poeticmetric_test" //nolint:gosec
	user := "poeticmetric_test"

	container, err := testcontainerspostgres.Run(
		ctx,
		"postgres:16-alpine",
		testcontainerspostgres.WithDatabase(database),
		testcontainerspostgres.WithPassword(password),
		testcontainerspostgres.WithUsername(user),
		testcontainerspostgres.BasicWaitStrategies(),
	)
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}

	host, err := container.Host(ctx)
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}

	mappedPort, err := container.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}

	logLevel := logger.Silent

	if config.Debug() {
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
		t.Fatal(errors.Wrap(err, 0))
	}

	err = migration.Postgres(postgres, database)
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}

	return container, postgres
}
