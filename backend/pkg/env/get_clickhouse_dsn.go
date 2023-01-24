package env

import "fmt"

func GetClickhouseDsn() string {
	return fmt.Sprintf(
		"clickhouse://%s:%s@%s:%s/%s",
		Get(ClickHouseUser),
		Get(ClickHousePassword),
		Get(ClickHouseHost),
		Get(ClickHouseTcpPort),
		Get(ClickHouseDatabase),
	)
}
