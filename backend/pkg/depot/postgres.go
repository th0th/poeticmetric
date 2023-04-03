package depot

import (
	"database/sql"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/env"
)

func (dp *Depot) Postgres() *gorm.DB {
	var err error

	if dp.postgres == nil {
		dp.postgres, err = gorm.Open(postgres.Open(env.GetPostgresDsn()), env.GetGormPostgresConfig())
		if err != nil {
			panic(err)
		}
	}

	return dp.postgres
}

func (dp *Depot) WithPostgresTransaction(f func(*Depot) error, opts ...*sql.TxOptions) error {
	var err error

	err = dp.Postgres().Transaction(func(tx *gorm.DB) error {
		err = f(&Depot{
			_parent:    dp,
			clickHouse: dp.clickHouse,
			postgres:   tx,
			rabbitMq:   dp.rabbitMq,
		})
		if err != nil {
			return err
		}

		return nil
	}, opts...)
	if err != nil {
		return err
	}

	return nil
}
