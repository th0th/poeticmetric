package poeticmetric

import (
	"context"

	"gorm.io/gorm"
)

const servicePostgresKey servicePostgresContextKey = "postgres"

type ServiceWithPostgres interface {
	Postgres() *gorm.DB
}

func ServicePostgres(ctx context.Context, service ServiceWithPostgres) *gorm.DB {
	postgres := ctx.Value(servicePostgresKey)

	if postgres != nil {
		return postgres.(*gorm.DB)
	}

	return service.Postgres()
}

func ServicePostgresTransaction(ctx context.Context, service ServiceWithPostgres, f func(context.Context) error) error {
	postgres := ServicePostgres(ctx, service)

	err := postgres.Transaction(func(postgres2 *gorm.DB) error {
		ctx2 := context.WithValue(ctx, servicePostgresKey, postgres2)
		err2 := f(ctx2)
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

type servicePostgresContextKey string
