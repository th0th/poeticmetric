package bootstrap

import (
	"github.com/ClickHouse/clickhouse-go/v2/lib/proto"
	"github.com/golang-migrate/migrate/v4/database/clickhouse"
	"github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
)

type Status struct {
	IsReady bool `json:"isReady"`
}

func GetStatus(dp *depot.Depot) (*Status, error) {
	status := &Status{}

	// PostgreSQL
	var countPg int64

	err := dp.Postgres().
		Table(postgres.DefaultMigrationsTable).
		Select("version").
		Limit(1).
		Count(&countPg).
		Error
	if err != nil {
		pgError, ok := err.(*pgconn.PgError)
		if !ok || pgError.Code != "42P01" {
			return nil, err
		}
	} else {
		return status, nil
	}

	// ClickHouse
	var countCh int64

	err = dp.ClickHouse().
		Table(clickhouse.DefaultMigrationsTable).
		Select("version").
		Limit(1).
		Count(&countCh).
		Error
	if err != nil {
		chError, ok := err.(*proto.Exception)
		if !ok || chError.Code != 60 {
			return nil, err
		}
	} else {
		return status, nil
	}

	status.IsReady = true

	return status, nil
}
