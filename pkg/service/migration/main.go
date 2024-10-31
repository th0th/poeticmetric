package migration

import (
	"database/sql"
	"embed"
	"errors"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	clickhouse2 "github.com/golang-migrate/migrate/v4/database/clickhouse"
	postgres2 "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"golang.org/x/sync/errgroup"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

type NewParams struct {
	Clickhouse *sql.DB
	EnvService poeticmetric.EnvService
	Postgres   *sql.DB
}

type service struct {
	clickhouse *sql.DB
	envService poeticmetric.EnvService
	postgres   *sql.DB
}

func New(params *NewParams) poeticmetric.MigrationService {
	return &service{
		clickhouse: params.Clickhouse,
		envService: params.EnvService,
		postgres:   params.Postgres,
	}
}

func (s *service) Run() error {
	errGroup := errgroup.Group{}

	errGroup.Go(func() error {
		err := s.migratePostgres()
		if err != nil {
			return fmt.Errorf("failed to migrate postgres: %w", err)
		}

		return nil
	})

	errGroup.Go(func() error {
		err := s.migrateClickhouse()
		if err != nil {
			return fmt.Errorf("failed to migrate clickhouse: %w", err)
		}

		return nil
	})

	err := errGroup.Wait()
	if err != nil {
		return err
	}

	return nil
}

func (s *service) migrateClickhouse() error {
	databaseName := s.envService.ClickhouseDatabase()

	sourceInstance, err := iofs.New(clickhouseFiles, "files/clickhouse")
	if err != nil {
		return fmt.Errorf("failed to create source instance: %w", err)
	}

	databaseInstance, err := clickhouse2.WithInstance(s.clickhouse, &clickhouse2.Config{
		DatabaseName:          databaseName,
		MultiStatementEnabled: true,
	})
	if err != nil {
		return fmt.Errorf("failed to create database instance: %w", err)
	}

	migrator, err := migrate.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return fmt.Errorf("failed to create migrator: %w", err)
	}

	err = migrator.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("failed to run: %w", err)
	}

	return nil
}

func (s *service) migratePostgres() error {
	databaseName := s.envService.Vars().PostgresDatabase

	sourceInstance, err := iofs.New(postgresFiles, "files/postgres")
	if err != nil {
		return err
	}

	databaseInstance, err := postgres2.WithInstance(s.postgres, &postgres2.Config{
		DatabaseName: databaseName,
	})
	if err != nil {
		return err
	}

	migrator, err := migrate.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return err
	}

	err = migrator.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}

	return nil
}

//go:embed files/clickhouse/*.sql
var clickhouseFiles embed.FS

//go:embed files/postgres/*.sql
var postgresFiles embed.FS
