package poeticmetric

import (
	"net/smtp"

	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type EnvService interface {
	ClickhouseDatabase() string
	ClickhouseDsn() string
	Debug() bool
	FrontendUrl(path string) string
	GoogleOAuthConfig() (*oauth2.Config, error)
	GormConfig() *gorm.Config
	IsHosted() bool
	PostgresDatabase() string
	PostgresDsn() string
	RedisAddr() string
	RedisPassword() string
	RestApiBasePath() string
	SmtpAddr() string
	SmtpAuth() smtp.Auth
	SmtpFrom() string
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

	// Google
	GoogleClientID     *string `env:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret *string `env:"GOOGLE_CLIENT_SECRET"`

	// Postgres
	PostgresDatabase string `env:"POSTGRES_DATABASE,notEmpty,required"`
	PostgresHost     string `env:"POSTGRES_HOST,notEmpty,required"`
	PostgresPassword string `env:"POSTGRES_PASSWORD,notEmpty,required"`
	PostgresPort     int    `env:"POSTGRES_PORT,notEmpty,required"`
	PostgresUser     string `env:"POSTGRES_USER,notEmpty,required"`

	// Redis
	RedisHost     string `env:"REDIS_HOST,notEmpty,required"`
	RedisPassword string `env:"REDIS_PASSWORD"`
	RedisPort     int    `env:"REDIS_PORT,notEmpty,required"`

	// SMTP
	SmtpFrom     string `env:"SMTP_FROM,notEmpty,required"`
	SmtpHost     string `env:"SMTP_HOST,notEmpty,required"`
	SmtpPassword string `env:"SMTP_PASSWORD"`
	SmtpPort     string `env:"SMTP_PORT,notEmpty,required"`
	SmtpUser     string `env:"SMTP_USER"`
}
