package poeticmetric

import (
	"net/smtp"

	"gorm.io/gorm"
)

type EnvService interface {
	ClickhouseDatabase() string
	ClickhouseDsn() string
	Debug() bool
	FrontendUrl(path string) string
	GormConfig() *gorm.Config
	IsHosted() bool
	PostgresDatabase() string
	PostgresDsn() string
	RestApiBasePath() string
	SmtpAddr() string
	SmtpAuth() smtp.Auth
}

type EnvServiceVars struct {
	DatabaseDebug   bool   `env:"DATABASE_DEBUG" envDefault:"false"`
	Debug           bool   `env:"DEBUG" envDefault:"false"`
	FrontendBaseUrl string `env:"FRONTEND_BASE_URL,notEmpty,required"`
	IsHosted        bool   `env:"IS_HOSTED" envDefault:"false"`

	// Clickhouse
	ClickhouseDatabase string `env:"CLICKHOUSE_DATABASE,notEmpty,required"`
	ClickhouseHost     string `env:"CLICKHOUSE_HOST,notEmpty,required"`
	ClickhousePassword string `env:"CLICKHOUSE_PASSWORD,notEmpty,required"`
	ClickhousePort     int    `env:"CLICKHOUSE_PORT,notEmpty,required"`
	ClickhouseUser     string `env:"CLICKHOUSE_USER,notEmpty,required"`

	// Postgres
	PostgresDatabase string `env:"POSTGRES_DATABASE,notEmpty,required"`
	PostgresHost     string `env:"POSTGRES_HOST,notEmpty,required"`
	PostgresPassword string `env:"POSTGRES_PASSWORD,notEmpty,required"`
	PostgresPort     int    `env:"POSTGRES_PORT,notEmpty,required"`
	PostgresUser     string `env:"POSTGRES_USER,notEmpty,required"`

	// RabbitMQ
	RabbitMqHost     string `env:"RABBITMQ_HOST,notEmpty,required"`
	RabbitMqPassword string `env:"RABBITMQ_PASSWORD,notEmpty,required"`
	RabbitMqPort     int    `env:"RABBITMQ_PORT,notEmpty,required"`
	RabbitMqUser     string `env:"RABBITMQ_USER,notEmpty,required"`
	RabbitMqVhost    string `env:"RABBITMQ_VHOST,notEmpty,required"`

	// SMTP
	SmtpFrom     string `env:"SMTP_FROM,notEmpty,required"`
	SmtpHost     string `env:"SMTP_HOST,notEmpty,required"`
	SmtpPassword string `env:"SMTP_PASSWORD"`
	SmtpPort     string `env:"SMTP_PORT,notEmpty,required"`
	SmtpUser     string `env:"SMTP_USER"`
}
