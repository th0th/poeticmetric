package validator

import "github.com/poeticmetric/poeticmetric/backend/pkg/depot"

func ClickhouseTimeZone(dp *depot.Depot, v string) bool {
	var count int64

	err := dp.ClickHouse().
		Table("system.time_zones").
		Where("time_zone = ?", v).
		Limit(1).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
