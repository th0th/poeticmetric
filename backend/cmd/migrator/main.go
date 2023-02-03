package main

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/bsm/redislock"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/clickhouse"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/sentry"
	"github.com/poeticmetric/poeticmetric/backend/pkg/signal"
)

func main() {
	ctx := context.Background()

	var lock *redislock.Lock

	go signal.RunAndExit(func() int {
		if lock != nil {
			err := lock.Release(ctx)
			if err != nil {
				return 1
			}
		}

		return 0
	})

	err := env.Check()
	if err != nil {
		log.Panicln(err)
	}

	err = sentry.InitIfEnabled()
	if err != nil {
		log.Panicln(err)
	}

	dp := depot.New()

	locker := redislock.New(dp.Redis())

	lock, err = locker.Obtain(ctx, "migration", 1 * time.Minute, nil)
	if err != nil {
		if errors.Is(err, redislock.ErrNotObtained) {
			log.Panicln("Couldn't obtain the migration lock. There seems to be an ongoing database migration. Exiting...")
		}

		log.Panicln(err)
	}

	defer lock.Release(ctx)

	migratePostgres, err := migrate.New("file:///poeticmetric/migrations/postgres", env.GetPostgresDsn())
	if err != nil {
		log.Panicln(err)
	}

	migrateClickhouse, err := migrate.New("file:///poeticmetric/migrations/clickhouse", env.GetClickhouseDsn()+"?x-multi-statement=true")
	if err != nil {
		log.Panicln(err)
	}

	// PostgreSQL
	log.Println("📝 Running PostgreSQL migrations...")

	err = migratePostgres.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Panicf("An error has occurred: %v", err)
	}

	log.Println("📝 Running PostgreSQL migrations... ✅")

	// ClickHouse
	log.Println("📊 Running ClickHouse migrations...")

	err = migrateClickhouse.Up()
	if err != nil && !errors.Is(err, migrate.ErrNoChange) {
		log.Panicf("An error has occurred: %v", err)
	}

	log.Println("📊 Running ClickHouse migrations... ✅")
}
