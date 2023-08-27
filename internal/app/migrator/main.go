package migrator

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/bsm/redislock"
	"github.com/go-errors/errors"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/clickhouse"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"

	context2 "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/sentry"
	"github.com/th0th/poeticmetric/internal/signal"
)

func Run() {
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

	err := sentry.InitIfEnabled()
	if err != nil {
		log.Panicln(err)
	}

	locker := redislock.New(context2.Rd(ctx))

	lock, err = locker.Obtain(ctx, "migration", 1*time.Minute, nil)
	if err != nil {
		if errors.Is(err, redislock.ErrNotObtained) {
			log.Panicln("Couldn't obtain the migration lock. There seems to be an ongoing database migration. Exiting...")
		}

		log.Panicln(err)
	}

	defer func(lock *redislock.Lock, ctx context.Context) {
		err2 := lock.Release(ctx)
		if err2 != nil {
			panic(errors.Wrap(err2, 0))
		}
	}(lock, ctx)

	migratePostgres, err := migrate.New(fmt.Sprintf("file://%s/migrations/postgres", env.Get().BasePath), env.GetPostgresDsn())
	if err != nil {
		log.Panicln(err)
	}

	migrateClickhouse, err := migrate.New(fmt.Sprintf("file://%s/migrations/clickhouse", env.Get().BasePath), env.GetClickhouseDsn()+"?x-multi-statement=true")
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
