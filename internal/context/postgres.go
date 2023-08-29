package context

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/internal/env"
)

const postgresKey = "postgres"

func Postgres(ctx context.Context) *gorm.DB {
	return ctx.Value(postgresKey).(*gorm.DB)
}

func WithPostgres(ctx context.Context) context.Context {
	pg, err := gorm.Open(postgres.Open(env.GetPostgresDsn()), env.GetGormPostgresConfig())
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	return context.WithValue(ctx, postgresKey, pg)
}

func PostgresTransaction(ctx context.Context, f func(context.Context) error) error {
	return Postgres(ctx).Transaction(func(tx *gorm.DB) error {
		ctx2 := context.WithValue(ctx, postgresKey, tx)

		return f(ctx2)
	})
}
