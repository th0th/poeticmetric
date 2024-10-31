package migration

import (
	"context"
	"embed"
	"path"

	"github.com/go-errors/errors"
	migrate2 "github.com/golang-migrate/migrate/v4"
	clickhouse2 "github.com/golang-migrate/migrate/v4/database/clickhouse"
	postgres2 "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	Clickhouse *gorm.DB
	EnvService poeticmetric.EnvService
	Postgres   *gorm.DB
}

type service struct {
	clickhouse *gorm.DB
	envService poeticmetric.EnvService
	postgres   *gorm.DB
}

func New(params *NewParams) poeticmetric.MigrationService {
	return &service{
		clickhouse: params.Clickhouse,
		envService: params.EnvService,
		postgres:   params.Postgres,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) Run() error {
	err := poeticmetric.ServicePostgresTransaction(context.Background(), s, func(ctx2 context.Context) error {
		err2 := s.runPostgres(ctx2)
		if err2 != nil {
			return err2
		}

		err2 = s.runClickhouse()
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return err
	}

	return nil
}

func (s *service) runClickhouse() error {
	databaseName := s.envService.ClickhouseDatabase()

	sourceInstance, err := iofs.New(files, path.Join("files", "clickhouse"))
	if err != nil {
		return err
	}

	db, err := s.clickhouse.DB()
	if err != nil {
		return err
	}

	databaseInstance, err := clickhouse2.WithInstance(db, &clickhouse2.Config{
		DatabaseName:          databaseName,
		MultiStatementEnabled: true,
	})
	if err != nil {
		return err
	}

	migrate, err := migrate2.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return err
	}

	err = migrate.Up()
	if err != nil && !errors.Is(err, migrate2.ErrNoChange) {
		return err
	}

	return nil
}

func (s *service) runPostgres(ctx context.Context) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	databaseName := s.envService.PostgresDatabase()

	sourceInstance, err := iofs.New(files, path.Join("files", "postgres"))
	if err != nil {
		return err
	}

	db, err := postgres.DB()
	if err != nil {
		return err
	}

	databaseInstance, err := postgres2.WithInstance(db, &postgres2.Config{
		DatabaseName: databaseName,
	})
	if err != nil {
		return err
	}

	migrate, err := migrate2.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return err
	}

	err = migrate.Up()
	if err != nil && !errors.Is(err, migrate2.ErrNoChange) {
		return err
	}

	return nil
}

//go:embed files
var files embed.FS
