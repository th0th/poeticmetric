package worker

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"sync"
	"time"

	"github.com/go-errors/errors"
	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	EnvService   poeticmetric.EnvService
	EventService poeticmetric.EventService
	RabbitMq     *amqp.Connection
}

type service struct {
	channel      *amqp.Channel
	envService   poeticmetric.EnvService
	eventService poeticmetric.EventService
	rabbitMq     *amqp.Connection
	runners      map[poeticmetric.WorkName]func(context.Context, []byte) error
}

func New(params NewParams) poeticmetric.Worker {
	s := &service{
		envService:   params.EnvService,
		eventService: params.EventService,
		rabbitMq:     params.RabbitMq,
	}

	s.runners = map[poeticmetric.WorkName]func(context.Context, []byte) error{
		poeticmetric.WorkCreateEvent: s.createEvent,
	}

	return s
}

func (s *service) Run(ctx context.Context) error {
	err := s.openConsumeChannel(ctx)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	errs := []error{}
	consumeChannel := make(chan amqp.Delivery, s.envService.WorkerConcurrency())
	for _, queue := range s.envService.WorkerQueues() {
		consumerName := fmt.Sprintf("consumer-%s-%s", queue, uuid.NewString())
		ch, err2 := s.channel.Consume(queue, consumerName, false, false, false, false, nil)
		if err2 != nil {
			errs = append(errs, errors.Wrap(err2, 0))
			continue
		}

		go func(ch <-chan amqp.Delivery) {
			for msg := range ch {
				consumeChannel <- msg
			}
		}(ch)
	}
	if len(errs) > 0 {
		return errors.Wrap(errors.Join(errs...), 0)
	}
	Logger.Info().Strs("queues", s.envService.WorkerQueues()).Msg("started worker")

	var wg sync.WaitGroup

	for {
		select {
		case <-ctx.Done():
			Logger.Info().Msg("context is done, waiting for existing tasks to complete")
			wg.Wait()
			Logger.Info().Msg("all tasks are completed, exiting")
			return nil
		case delivery := <-consumeChannel:
			wg.Add(1)
			go func() {
				defer wg.Done()
				s.processDelivery(ctx, delivery)
			}()
		}
	}
}

func (s *service) openConsumeChannel(ctx context.Context) error {
	channel, err := s.rabbitMq.Channel()
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = channel.Qos(s.envService.WorkerConcurrency(), 0, false)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	s.channel = channel

	go func() {
		if <-s.channel.NotifyClose(make(chan *amqp.Error)) != nil {
			if ctx.Err() != nil {
				Logger.Info().Msg("consume channel is closed, and the context is done")

				return
			}

			var err2 error
			for retryCount := 0; retryCount < 3; retryCount += 1 {
				secondsToWait := 3 * (retryCount + 1)

				if retryCount > 0 {
					Logger.Warn().Msgf("consume channel is closed. trying to reopen in %d seconds... (%d)", secondsToWait, retryCount)
				} else {
					Logger.Warn().Msgf("consume channel is closed. trying to reopen in %d seconds...", secondsToWait)
				}

				time.Sleep(time.Duration(secondsToWait) * time.Second)

				err2 = s.openConsumeChannel(ctx)
				if err2 != nil {
					err = err2
				} else {
					Logger.Info().Msg("reopened the publish channel")
					break
				}
			}

			if err2 != nil {
				panic(errors.Wrap(err2, 0))
			}
		}
	}()

	return nil
}

func (s *service) processDelivery(ctx context.Context, delivery amqp.Delivery) {
	logger := Logger.With().Str("routingKey", delivery.RoutingKey).RawJSON("deliveryBody", delivery.Body).Logger()

	// recover
	defer func() {
		r := recover()
		if r != nil {
			logger.Error().Msgf("worker recovered with panic: %v", r)
		}
	}()

	// acknowledge
	defer func() {
		err := delivery.Ack(false)
		if err != nil {
			logger.Error().Stack().Err(err).Msg("failed to acknowledge task")
		}
	}()

	work := poeticmetric.Work[any]{}
	err := json.Unmarshal(delivery.Body, &work)
	if err != nil {
		Logger.Error().Stack().Err(err).Msg("failed to unmarshal delivery body")
		return
	}

	err = s.runners[work.Name](ctx, delivery.Body)
	if err != nil {
		logger.Error().Stack().Err(err).Msg("failed to run task")
	} else {
		logger.Info().Msg("completed task")
	}
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
