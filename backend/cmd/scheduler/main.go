package main

import (
	"context"
	"os"
	"os/signal"
	"sort"
	"syscall"

	"github.com/go-co-op/gocron/v2"
	"github.com/go-errors/errors"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
	"github.com/th0th/poeticmetric/backend/pkg/service/workpublisher"
)

type schedulerJob struct {
	f             func(context.Context) error
	jobDefinition gocron.JobDefinition
}

type schedulerJobs map[string]schedulerJob

func main() {
	ctx := context.Background()

	envService, err := env.New()
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("env initialization failed")
	}

	rabbitMQ, err := amqp.Dial(envService.RabbitMqURL())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("rabbitMQ initialization failed")
	}
	defer rabbitMQ.Close()

	err = poeticmetric.DeclareQueues(rabbitMQ)
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("rabbitMQ queue declaration failed")
	}

	workPublisher := workpublisher.New(workpublisher.NewParams{
		RabbitMQ: rabbitMQ,
	})

	scheduler, err := gocron.NewScheduler()
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("scheduler initialization failed")
	}

	jobs := schedulerJobs{}

	if envService.UnverifiedOrganizationDeletionDays() != nil {
		jobs["DeleteUnverifiedOrganizations"] = schedulerJob{
			f:             workPublisher.DeleteUnverifiedOrganizations,
			jobDefinition: gocron.CronJob("0 8 * * *", false),
		}
	}

	names := make([]string, 0, len(jobs))
	for key := range jobs {
		names = append(names, key)
	}
	sort.Strings(names)

	var errs []error
	for _, name := range names {
		err = add(ctx, scheduler, name, jobs[name])
		if err != nil {
			errs = append(errs, err)
		}
	}
	if len(errs) > 0 {
		Logger.Panic().Stack().Err(errors.Join(errs...))
	}

	scheduler.Start()
	Logger.Info().Strs("jobs", names).Msg("scheduler started")

	signals := make(chan os.Signal, 1)
	defer close(signals)
	signal.Notify(signals, syscall.SIGINT)
	<-signals

	Logger.Info().Msg("shutting down scheduler")
	err = scheduler.Shutdown()
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("scheduler shutdown failed")
	}
}

func add(ctx context.Context, scheduler gocron.Scheduler, name string, job schedulerJob) error {
	_, err := scheduler.NewJob(job.jobDefinition, gocron.NewTask(func() {
		logger := Logger.With().Str("task", name).Logger()

		err2 := job.f(ctx)
		if err2 != nil {
			logger.Error().Stack().Err(err2).Msg("failed")
		} else {
			logger.Info().Msg("done")
		}
	}))
	return err
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
