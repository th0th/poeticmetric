package depot

import (
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"gorm.io/driver/clickhouse"
	"gorm.io/gorm"
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
