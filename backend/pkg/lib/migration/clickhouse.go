package migration

import (
	"embed"
	"path"

	"github.com/go-errors/errors"
	"github.com/golang-migrate/migrate/v4"
	migrateclickhouse "github.com/golang-migrate/migrate/v4/database/clickhouse"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"gorm.io/gorm"
)

func ClickHouse(clickHouse *gorm.DB, databaseName string) error {
	sourceInstance, err := iofs.New(clickhouseFiles, path.Join("files", "clickhouse"))
	if err != nil {
		return err
	}

	db, err := clickHouse.DB()
	if err != nil {
		return err
	}

	databaseInstance, err := migrateclickhouse.WithInstance(db, &migrateclickhouse.Config{
		DatabaseName:          databaseName,
		MultiStatementEnabled: true,
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

//go:embed files/clickhouse
var clickhouseFiles embed.FS
