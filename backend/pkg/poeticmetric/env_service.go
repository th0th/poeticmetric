package poeticmetric

import (
	"net/mail"
	"net/smtp"

	govalkey "github.com/valkey-io/valkey-go"
	"golang.org/x/oauth2"
	"gorm.io/gorm"
)

type EnvService interface {
	ClickHouseDatabase() string
	ClickHouseDsn() string
	ConfigureStripe()
	Debug() bool
	DefaultPlanName() *string
	FrontendURL(path string) string
	GoogleOAuthConfig() (*oauth2.Config, error)
	GormConfig() *gorm.Config
	IsHosted() bool
	PostgresDatabase() string
	PostgresDsn() string
	RabbitMqURL() string
	RESTApiURL(path string) string
	RESTApiBasePath() *string
	SmtpAddr() string
	SmtpAuth() smtp.Auth
	SmtpFrom() *mail.Address
	StripeAllowPromotionCodes() bool
	StripeMetaEnvironment() string
	StripeWebhookSigningSecret() string
	UnverifiedOrganizationDeletionDays() *int
	ValkeyAddr() string
	ValkeyClientOption() govalkey.ClientOption
	ValkeyPassword() string
	WorkerConcurrency() int
	WorkerQueues() []string
}

type EnvServiceVars struct {
	DatabaseDebug   bool    `env:"DATABASE_DEBUG" envDefault:"false"`
	Debug           bool    `env:"DEBUG" envDefault:"false"`
	FrontendBaseURL string  `env:"FRONTEND_BASE_URL,notEmpty,required"`
	IsHosted        bool    `env:"IS_HOSTED" envDefault:"false"`
	RESTApiBaseURL  string  `env:"REST_API_BASE_URL,notEmpty,required"`
	RESTApiBasePath *string `env:"REST_API_BASE_PATH"`

	// Clickhouse
	ClickhouseDatabase string `env:"CLICKHOUSE_DATABASE,notEmpty,required"`
	ClickhouseHost     string `env:"CLICKHOUSE_HOST,notEmpty,required"`
	ClickhousePassword string `env:"CLICKHOUSE_PASSWORD,notEmpty,required"`
	ClickhousePort     int    `env:"CLICKHOUSE_PORT,notEmpty,required"`
	ClickhouseUser     string `env:"CLICKHOUSE_USER,notEmpty,required"`

	// Google
	GoogleClientID     *string `env:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret *string `env:"GOOGLE_CLIENT_SECRET"`

	// PoeticMetric
	DefaultPlanName                    *string  `env:"DEFAULT_PLAN_NAME"`
	UnverifiedOrganizationDeletionDays *int     `env:"UNVERIFIED_ORGANIZATION_DELETION_DAYS"`
	WorkerConcurrency                  int      `env:"WORKER_CONCURRENCY" envDefault:"1"`
	WorkerQueues                       []string `env:"WORKER_QUEUES" envDefault:""`

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
	SmtpFromAddress string `env:"SMTP_FROM_ADDRESS,notEmpty,required"`
	SmtpHost        string `env:"SMTP_HOST,notEmpty,required"`
	SmtpPassword    string `env:"SMTP_PASSWORD"`
	SmtpPort        string `env:"SMTP_PORT,notEmpty,required"`
	SmtpUser        string `env:"SMTP_USER"`

	// Stripe
	StripeAllowPromotionCodes  bool    `env:"STRIPE_ALLOW_PROMOTION_CODES" envDefault:"false"`
	StripeMetaEnvironment      *string `env:"STRIPE_META_ENVIRONMENT"`
	StripePublishableKey       *string `env:"STRIPE_PUBLISHABLE_KEY"`
	StripeSecretKey            *string `env:"STRIPE_SECRET_KEY"`
	StripeWebhookSigningSecret *string `env:"STRIPE_WEBHOOK_SIGNING_SECRET"`

	// Valkey
	ValkeyHost     string `env:"VALKEY_HOST,notEmpty,required"`
	ValkeyPassword string `env:"VALKEY_PASSWORD,notEmpty,required"`
	ValkeyPort     int    `env:"VALKEY_PORT,notEmpty,required"`
}
