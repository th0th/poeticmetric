package depot

import (
	"gorm.io/driver/clickhouse"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/env"
)

func (dp *Depot) ClickHouse() *gorm.DB {
	var err error

	if dp.clickHouse == nil {
		dp.clickHouse, err = gorm.Open(clickhouse.Open(env.GetClickhouseDsn()), env.GetGormClickhouseConfig())

		if err != nil {
			panic(err)
		}
	}

	return dp.clickHouse
}
