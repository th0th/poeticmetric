package env

import (
	"fmt"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
	"log"
	"os"
	"strings"
	"time"
)

const (
	StageDevelopment = "development"
	StageProduction  = "production"
	StageStaging     = "staging"
	StageTest        = "test"
)

const (
	InstanceRestApi   = "rest-api"
	InstanceScheduler = "scheduler"
	InstanceWorker    = "worker"
)

const (
	ClickHouseDatabase         = "POETICMETRIC_CLICKHOUSE_DATABASE"
	ClickHouseHost             = "POETICMETRIC_CLICKHOUSE_HOST"
	ClickHousePassword         = "POETICMETRIC_CLICKHOUSE_PASSWORD"
	ClickHouseTcpPort          = "POETICMETRIC_CLICKHOUSE_TCP_PORT"
	ClickHouseUser             = "POETICMETRIC_CLICKHOUSE_USER"
	Debug                      = "POETICMETRIC_DEBUG"
	FrontendBaseUrl            = "POETICMETRIC_FRONTEND_BASE_URL"
	Hosted                     = "POETICMETRIC_HOSTED"
	Instance                   = "POETICMETRIC_INSTANCE"
	PostgresDatabase           = "POETICMETRIC_POSTGRES_DATABASE"
	PostgresHost               = "POETICMETRIC_POSTGRES_HOST"
	PostgresPassword           = "POETICMETRIC_POSTGRES_PASSWORD"
	PostgresPort               = "POETICMETRIC_POSTGRES_PORT"
	PostgresUser               = "POETICMETRIC_POSTGRES_USER"
	RabbitMqHost               = "POETICMETRIC_RABBITMQ_HOST"
	RabbitMqPassword           = "POETICMETRIC_RABBITMQ_PASSWORD"
	RabbitMqPort               = "POETICMETRIC_RABBITMQ_PORT"
	RabbitMqUser               = "POETICMETRIC_RABBITMQ_USER"
	RabbitMqVhost              = "POETICMETRIC_RABBITMQ_VHOST"
	RedisHost                  = "POETICMETRIC_REDIS_HOST"
	RedisPassword              = "POETICMETRIC_REDIS_PASSWORD"
	RedisPort                  = "POETICMETRIC_REDIS_PORT"
	ResourcesBaseUrl           = "POETICMETRIC_RESOURCES_BASE_URL"
	RestApiBaseUrl             = "POETICMETRIC_REST_API_BASE_URL"
	SentryDsn                  = "POETICMETRIC_SENTRY_DSN"
	SmtpHost                   = "POETICMETRIC_SMTP_HOST"
	SmtpPassword               = "POETICMETRIC_SMTP_PASSWORD"
	SmtpPort                   = "POETICMETRIC_SMTP_PORT"
	SmtpUser                   = "POETICMETRIC_SMTP_USER"
	Stage                      = "POETICMETRIC_STAGE"
	StripeSecretKey            = "POETICMETRIC_STRIPE_SECRET_KEY"
	StripeWebhookSigningSecret = "POETICMETRIC_STRIPE_WEBHOOK_SIGNING_SECRET"
	WebhookUrl                 = "POETICMETRIC_WEBHOOK_URL"
	WorkerConcurrency          = "POETICMETRIC_WORKER_CONCURRENCY"
	WorkerQueues               = "POETICMETRIC_WORKER_QUEUES"
)

var (
	commonEnvVarNames = []string{
		ClickHouseDatabase,
		ClickHouseHost,
		ClickHousePassword,
		ClickHouseTcpPort,
		ClickHouseUser,
		FrontendBaseUrl,
		Instance,
		PostgresDatabase,
		PostgresHost,
		PostgresPassword,
		PostgresPort,
		PostgresUser,
		RabbitMqHost,
		RabbitMqPassword,
		RabbitMqPort,
		RabbitMqUser,
		RabbitMqVhost,
		RedisHost,
		RedisPassword,
		RedisPort,
		ResourcesBaseUrl,
		RestApiBaseUrl,
		SentryDsn,
		SmtpHost,
		SmtpPassword,
		SmtpPort,
		SmtpUser,
		Stage,
		StripeSecretKey,
		StripeWebhookSigningSecret,
	}

	workerEnvVarNames = []string{
		WorkerConcurrency,
		WorkerQueues,
	}
)

func Check() error {
	var err error

	missingEnvVarNames := []string{}

	for _, envVarName := range commonEnvVarNames {
		if Get(envVarName) == "" {
			missingEnvVarNames = append(missingEnvVarNames, envVarName)
		}
	}

	if Get(Instance) == InstanceWorker {
		for _, envVarName := range workerEnvVarNames {
			if Get(envVarName) == "" {
				missingEnvVarNames = append(missingEnvVarNames, envVarName)
			}
		}
	}

	if len(missingEnvVarNames) != 0 {
		err = fmt.Errorf("some environment variables are missing: %s", strings.Join(missingEnvVarNames, ", "))
	}

	return err
}

func Get(name string) string {
	return os.Getenv(name)
}

func GetDebug() bool {
	return Get(Debug) != "" && Get(Debug) != "0"
}

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

func GetGormClickhouseConfig() *gorm.Config {
	logLevel := logger.Silent

	if GetDebug() {
		logLevel = logger.Info
	}

	return &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: time.Second,
				LogLevel:      logLevel,
				Colorful:      true,
			},
		),
	}
}

func GetGormPostgresConfig() *gorm.Config {
	logLevel := logger.Silent

	if GetDebug() {
		logLevel = logger.Info
	}

	return &gorm.Config{
		Logger: logger.New(
			log.New(os.Stdout, "\r\n", log.LstdFlags),
			logger.Config{
				SlowThreshold: time.Second,
				LogLevel:      logLevel,
				Colorful:      true,
			},
		),
	}
}

func GetPostgresDsn() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		Get(PostgresHost),
		Get(PostgresUser),
		Get(PostgresPassword),
		Get(PostgresDatabase),
		Get(PostgresPort),
	)
}

func GetRabbitMqUrl() string {
	return fmt.Sprintf(
		"amqp://%s:%s@%s:%s/%s",
		Get(RabbitMqUser),
		Get(RabbitMqPassword),
		Get(RabbitMqHost),
		Get(RabbitMqPort),
		Get(RabbitMqVhost),
	)
}

func GetWorkerQueues() []string {
	return strings.Split(Get(WorkerQueues), ",")
}

func GetIsHosted() bool {
	return Get(Hosted) == "true"
}
