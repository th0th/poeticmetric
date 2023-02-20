package env

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

const (
	ClickHouseDatabase         = "CLICKHOUSE_DATABASE"
	ClickHouseHost             = "CLICKHOUSE_HOST"
	ClickHousePassword         = "CLICKHOUSE_PASSWORD"
	ClickHouseTcpPort          = "CLICKHOUSE_TCP_PORT"
	ClickHouseUser             = "CLICKHOUSE_USER"
	Debug                      = "DEBUG"
	FrontendBaseUrl            = "FRONTEND_BASE_URL"
	Hosted                     = "HOSTED"
	Instance                   = "INSTANCE"
	NodeRedBaseUrl             = "NODE_RED_BASE_URL"
	PostgresDatabase           = "POSTGRES_DATABASE"
	PostgresHost               = "POSTGRES_HOST"
	PostgresPassword           = "POSTGRES_PASSWORD"
	PostgresPort               = "POSTGRES_PORT"
	PostgresUser               = "POSTGRES_USER"
	RabbitMqHost               = "RABBITMQ_HOST"
	RabbitMqPassword           = "RABBITMQ_PASSWORD"
	RabbitMqPort               = "RABBITMQ_PORT"
	RabbitMqUser               = "RABBITMQ_USER"
	RabbitMqVhost              = "RABBITMQ_VHOST"
	RedisHost                  = "REDIS_HOST"
	RedisPassword              = "REDIS_PASSWORD"
	RedisPort                  = "REDIS_PORT"
	RestApiBaseUrl             = "REST_API_BASE_URL"
	SentryDsn                  = "SENTRY_DSN"
	SentryEnvironment          = "SENTRY_ENVIRONMENT"
	SmtpHost                   = "SMTP_HOST"
	SmtpPassword               = "SMTP_PASSWORD"
	SmtpPort                   = "SMTP_PORT"
	SmtpUser                   = "SMTP_USER"
	StripeSecretKey            = "STRIPE_SECRET_KEY"
	StripeWebhookSigningSecret = "STRIPE_WEBHOOK_SIGNING_SECRET"
	WorkerCount                = "WORKER_COUNT"
	WorkerQueues               = "WORKER_QUEUES"
)

var (
	requiredEnvVarNames = []string{
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
		RestApiBaseUrl,
		SmtpHost,
		SmtpPort,
	}
)

func Check() error {
	var err error

	missingEnvVarNames := []string{}

	for _, envVarName := range requiredEnvVarNames {
		if Get(envVarName) == "" {
			missingEnvVarNames = append(missingEnvVarNames, envVarName)
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
	return Get(Debug) == "true"
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

func GetIsHosted() bool {
	return Get(Hosted) == "true"
}

func GetPostgresDsn() string {
	return fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s?sslmode=disable",
		Get(PostgresUser),
		Get(PostgresPassword),
		Get(PostgresHost),
		Get(PostgresPort),
		Get(PostgresDatabase),
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

func GetWorkerCount() int {
	count := Get(WorkerCount)

	if count == "" {
		return 1
	}

	workerCount, err := strconv.Atoi(count)
	if err != nil {
		log.Printf("An error has occurred while parsing the '%s' environment variable. Falling back to 1.", WorkerCount)
		return 1
	}

	return workerCount
}

func GetWorkerQueues() []string {
	return strings.Split(Get(WorkerQueues), ",")
}
