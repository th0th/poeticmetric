package postgres

import (
	"context"
	"fmt"
	"log"
	"os"
	"testing"
	"time"

	"github.com/go-errors/errors"
	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/wait"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	postgres2 "github.com/testcontainers/testcontainers-go/modules/postgres"

	"github.com/th0th/poeticmetric/backend/pkg/service/migration"
)

type Postgres struct {
	Container testcontainers.Container
	Db        *gorm.DB
}

func New(t *testing.T) *Postgres {
	ctx := context.Background()

	database := "webgazer_test"
	password := "webgazer_test" //nolint:gosec
	user := "webgazer_test"

	container, err := postgres2.RunContainer(
		ctx,
		testcontainers.WithImage("postgres:16-alpine"),
		postgres2.WithDatabase(database),
		postgres2.WithPassword(password),
		postgres2.WithUsername(user),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").WithOccurrence(2).WithStartupTimeout(5*time.Second),
		),
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

	//if testconfig.Debug() {
	//	logLevel = logger.Info
	//}

	db, err := gorm.Open(
		postgres.Open(
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

	migrationService := migration.New(migration.NewParams{
		Postgres: db,
	})
	err = migrationService.Run()
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}

	return &Postgres{
		Container: container,
		Db:        db,
	}
}
