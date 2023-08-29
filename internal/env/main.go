package env

import (
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/caarlos0/env/v9"
	"github.com/go-errors/errors"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/searchconsole/v1"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Vars struct {
	BasePath           string `env:"BASE_PATH" envDefault:"/poeticmetric"`
	BaseUrl            string `env:"BASE_URL,notEmpty,required"`
	ClickhouseDatabase string `env:"CLICKHOUSE_DATABASE,notEmpty,required"`
	ClickhouseHost     string `env:"CLICKHOUSE_HOST,notEmpty,required"`
	ClickhousePassword string `env:"CLICKHOUSE_PASSWORD,notEmpty,required"`
	ClickhousePort     int    `env:"CLICKHOUSE_PORT" envDefault:"9000"`
	ClickhouseUser     string `env:"CLICKHOUSE_USER,notEmpty,required"`
	Debug              bool   `env:"DEBUG" envDefault:"false"`
	GoogleClientId     string `env:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret string `env:"GOOGLE_CLIENT_SECRET"`
	PostgresDatabase   string `env:"POSTGRES_DATABASE,notEmpty,required"`
	PostgresHost       string `env:"POSTGRES_HOST,notEmpty,required"`
	PostgresPassword   string `env:"POSTGRES_PASSWORD,required"`
	PostgresPort       int    `env:"POSTGRES_PORT" envDefault:"5432"`
	PostgresUser       string `env:"POSTGRES_USER,notEmpty,required"`
	RedisHost          string `env:"REDIS_HOST,notEmpty,required"`
	RedisPassword      string `env:"REDIS_PASSWORD,required"`
	RedisPort          string `env:"REDIS_PORT,notEmpty,required"`
	SentryDsn          string `env:"SENTRY_DSN"`
	SentryEnvironment  string `env:"SENTRY_ENVIRONMENT"`
}

var vars Vars

func Get() Vars {
	return vars
}

func GetGormClickhouseConfig() *gorm.Config {
	logLevel := logger.Silent

	if vars.Debug {
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

func GetClickhouseDsn() string {
	return fmt.Sprintf(
		"clickhouse://%s:%s@%s:%d/%s",
		vars.ClickhouseUser,
		vars.ClickhousePassword,
		vars.ClickhouseHost,
		vars.ClickhousePort,
		vars.ClickhouseDatabase,
	)
}

func GetGoogleOauthConfig() *oauth2.Config {
	return &oauth2.Config{
		ClientID:     vars.GoogleClientId,
		ClientSecret: vars.GoogleClientSecret,
		Endpoint:     google.Endpoint,
		RedirectURL:  vars.BaseUrl,
		Scopes:       []string{searchconsole.WebmastersReadonlyScope},
	}
}

func GetGormPostgresConfig() *gorm.Config {
	logLevel := logger.Silent

	if vars.Debug {
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
		"postgres://%s:%s@%s:%d/%s?sslmode=disable",
		vars.PostgresUser,
		vars.PostgresPassword,
		vars.PostgresHost,
		vars.PostgresPort,
		vars.PostgresDatabase,
	)
}

func GetRedisAddr() string {
	return fmt.Sprintf("%s:%s", vars.RedisHost, vars.RedisPort)
}

func init() {
	err := env.Parse(&vars)
	if err != nil {
		var e env.AggregateError
		if errors.As(err, &e) {
			log.Fatal(strings.Join(strings.Split(e.Error(), "; "), "\n"))
		} else {
			fmt.Printf("%+v\n", err)
		}
	}
}
