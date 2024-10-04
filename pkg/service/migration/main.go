package migration

import (
	"embed"

	"github.com/go-errors/errors"
	migrate2 "github.com/golang-migrate/migrate/v4"
	postgres2 "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"golang.org/x/sync/errgroup"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
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
	errGroup := errgroup.Group{}

	errGroup.Go(func() error {
		err := s.migratePostgres()
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	err := errGroup.Wait()
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}

func (s *service) migratePostgres() error {
	databaseName := s.envService.Vars().PostgresDatabase

	sourceInstance, err := iofs.New(postgresFiles, "files")
	if err != nil {
		return errors.Wrap(err, 0)
	}

	db, err := s.postgres.DB()
	if err != nil {
		return errors.Wrap(err, 0)
	}

	databaseInstance, err := postgres2.WithInstance(db, &postgres2.Config{
		DatabaseName: databaseName,
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	migrator, err := migrate2.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = migrator.Up()
	if err != nil && !errors.Is(err, migrate2.ErrNoChange) {
		return errors.Wrap(err, 0)
	}

	return nil
}

//go:embed files/clickhouse/*.sql
var clickhouseFiles embed.FS

//go:embed files/postgres/*.sql
var postgresFiles embed.FS
