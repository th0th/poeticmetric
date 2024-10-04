package migration

import (
	"context"
	"embed"
	"time"

	"github.com/bsm/redislock"
	"github.com/go-errors/errors"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/clickhouse"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

func Clickhouse(ch *gorm.DB, databaseName string) error {
	sourceInstance, err := iofs.New(clickhouseMigrations, "queries/clickhouse")
	if err != nil {
		return errors.Wrap(err, 0)
	}

	db, err := ch.DB()
	if err != nil {
		return errors.Wrap(err, 0)
	}

	databaseInstance, err := clickhouse.WithInstance(db, &clickhouse.Config{
		DatabaseName:          databaseName,
		MultiStatementEnabled: true,
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	m, err := migrate.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return errors.Wrap(err, 0)
	}

	return nil
}

func Postgres(pg *gorm.DB, databaseName string) error {
	sourceInstance, err := iofs.New(postgresMigrations, "queries/postgres")
	if err != nil {
		return errors.Wrap(err, 0)
	}

	db, err := pg.DB()
	if err != nil {
		return errors.Wrap(err, 0)
	}

	databaseInstance, err := postgres.WithInstance(db, &postgres.Config{
		DatabaseName: databaseName,
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	m, err := migrate.NewWithInstance("iofs", sourceInstance, databaseName, databaseInstance)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = m.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return errors.Wrap(err, 0)
	}

	return nil
}

func Run(redisClient *redis.Client, pg *gorm.DB, pgDatabaseName string, ch *gorm.DB, chDatabaseName string) error {
	ctx := context.Background()

	var lock *redislock.Lock

	locker := redislock.New(redisClient)

	lock, err := locker.Obtain(ctx, "migration", 1*time.Minute, &redislock.Options{
		RetryStrategy: redislock.LimitRetry(redislock.LinearBackoff(1*time.Second), 10),
	})
	if err != nil {
		return errors.Wrap(err, 0)
	}

	var lockReleaseErr error

	defer func() {
		lockReleaseErr = lock.Release(ctx)
	}()

	err = Postgres(pg, pgDatabaseName)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = Clickhouse(ch, chDatabaseName)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = lock.Release(ctx)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	if lockReleaseErr != nil {
		return errors.Wrap(lockReleaseErr, 0)
	}

	return nil
}

//go:embed files/clickhouse/*.sql
var clickhouseMigrations embed.FS

//go:embed files/postgres/*.sql
var postgresMigrations embed.FS
