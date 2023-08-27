package context

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/internal/env"
)

const postgresKey = "postgres"

func Pg(ctx context.Context) *gorm.DB {
	v := ctx.Value(postgresKey)

	if v == nil {
		pg, err := gorm.Open(postgres.Open(env.GetPostgresDsn()), env.GetGormPostgresConfig())
		if err != nil {
			panic(errors.Wrap(err, 0))
		}

		ctx = context.WithValue(ctx, postgresKey, pg)
	}

	return ctx.Value(postgresKey).(*gorm.DB)
}

func PgTransaction(ctx context.Context, fc func(pg *gorm.DB) error) error {
	return Pg(ctx).Transaction(fc)
}
