package context

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/driver/clickhouse"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/internal/env"
)

const clickhouseKey = "clickhouse"

func Ch(ctx context.Context) *gorm.DB {
	v := ctx.Value(clickhouseKey)

	if v == nil {
		ch, err := gorm.Open(clickhouse.Open(env.GetClickhouseDsn()), env.GetGormClickhouseConfig())
		if err != nil {
			panic(errors.Wrap(err, 0))
		}

		ctx = context.WithValue(ctx, clickhouseKey, ch)
	}

	return ctx.Value(clickhouseKey).(*gorm.DB)
}
