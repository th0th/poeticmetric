package poeticmetric

import (
	"gorm.io/gorm"
)

type EnvService interface {
	ClickhouseDsn() string
	Debug() bool
	GormConfig() *gorm.Config
	IsHosted() bool
	PostgresDsn() string
	RedisAddr() string
	SecretKey() string
	Vars() EnvServiceVars
}

type EnvServiceVars struct {
	BasePath      string `env:"BASE_PATH" envDefault:"/"`
	CommonBaseUrl string `env:"COMMON_BASE_URL"`
	DatabaseDebug bool   `env:"DATABASE_DEBUG" envDefault:"false"`
	Debug         bool   `env:"DEBUG" envDefault:"false"`
	IsHosted      bool   `env:"IS_HOSTED" envDefault:"false"`
	SecretKey     string `env:"SECRET_KEY,notEmpty,required"`

	// ClickHouse
	ClickHouseDatabase string `env:"CLICKHOUSE_DATABASE,notEmpty,required"`
	ClickHouseHost     string `env:"CLICKHOUSE_HOST,notEmpty,required"`
	ClickHousePassword string `env:"CLICKHOUSE_PASSWORD,notEmpty,required"`
	ClickHousePort     int    `env:"CLICKHOUSE_PORT,notEmpty,required"`
	ClickHouseUser     string `env:"CLICKHOUSE_USER,notEmpty,required"`

	// Postgres
	PostgresDatabase string `env:"POSTGRES_DATABASE,notEmpty,required"`
	PostgresHost     string `env:"POSTGRES_HOST,notEmpty,required"`
	PostgresPassword string `env:"POSTGRES_PASSWORD,notEmpty,required"`
	PostgresPort     int    `env:"POSTGRES_PORT,notEmpty,required"`
	PostgresUser     string `env:"POSTGRES_USER,notEmpty,required"`

	// Redis
	RedisHost     string `env:"REDIS_HOST,notEmpty,required"`
	RedisPassword string `env:"REDIS_PASSWORD,notEmpty,required"`
	RedisPort     int    `env:"REDIS_PORT,notEmpty,required"`
}
