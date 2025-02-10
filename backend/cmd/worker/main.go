package main

import (
	"context"
	"os"
	"os/signal"

	"github.com/go-errors/errors"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog"
	govalkey "github.com/valkey-io/valkey-go"
	"github.com/valkey-io/valkey-go/valkeylock"
	"gorm.io/driver/clickhouse"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
	"github.com/th0th/poeticmetric/backend/pkg/service/event"
	workerservice "github.com/th0th/poeticmetric/backend/pkg/service/worker"
)

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	envService, err := env.New()
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("env initialization failed")
	}

	postgres, err := gorm.Open(gormpostgres.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("postgres initialization failed")
	}

	clickHouse, err := gorm.Open(clickhouse.Open(envService.ClickHouseDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("clickhouse initialization failed")
	}

	rabbitMq, err := amqp.Dial(envService.RabbitMqURL())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("rabbitmq initialization failed")
	}
	defer rabbitMq.Close()

	err = poeticmetric.DeclareQueues(rabbitMq)
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("queue declaration failed")
	}

	valkey, err := govalkey.NewClient(envService.ValkeyClientOption())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("valkey initialization failed")
	}
	defer valkey.Close()

	// services
	eventService := event.New(event.NewParams{
		ClickHouse: clickHouse,
		Postgres:   postgres,
		Valkey:     valkey,
	})

	locker, err := valkeylock.NewLocker(valkeylock.LockerOption{
		ClientBuilder: func(option govalkey.ClientOption) (govalkey.Client, error) {
			return valkey, nil
		},
		KeyMajority:    1,
		NoLoopTracking: true,
	})
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("valkey locker initialization failed")
	}
	defer locker.Close()

	worker := workerservice.New(workerservice.NewParams{
		EnvService:   envService,
		EventService: eventService,
		RabbitMq:     rabbitMq,
	})

	go func() {
		err = worker.Run(ctx)
		if err != nil {
			Logger.Error().Stack().Err(errors.Wrap(err, 0)).Msg("worker run failed")
		}
	}()

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt)
	<-signalChannel
	cancel()
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
