package migration

import (
	"embed"
	"path"

	"github.com/go-errors/errors"
	"github.com/golang-migrate/migrate/v4"
	migratepostgres "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"gorm.io/gorm"
)

func Postgres(postgres *gorm.DB, databaseName string) error {
	sourceInstance, err := iofs.New(postgresFiles, path.Join("files", "postgres"))
	if err != nil {
		return err
	}

	db, err := postgres.DB()
	if err != nil {
		return err
	}

	databaseInstance, err := migratepostgres.WithInstance(db, &migratepostgres.Config{
		DatabaseName: databaseName,
	})
	if err != nil {
		return err
	}

	m, err := migrate.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return err
	}

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return err
	}

	return nil
}

//go:embed files/postgres
var postgresFiles embed.FS
