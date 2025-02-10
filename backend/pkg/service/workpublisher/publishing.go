package workpublisher

import (
	"encoding/json"
	"fmt"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) openPublishChannel() error {
	channel, err := s.rabbitMQ.Channel()
	if err != nil {
		return err
	}
	s.channel = channel

	go func() {
		if <-s.channel.NotifyClose(make(chan *amqp.Error)) != nil {
			var err2 error

			for retryCount := 0; retryCount < 3; retryCount += 1 {
				secondsToWait := 3 * (retryCount + 1)

				if retryCount > 0 {
					Logger.Warn().Msgf("publish channel is closed. trying to reopen in %d seconds... (%d)", secondsToWait, retryCount)
				} else {
					Logger.Warn().Msgf("publish channel is closed. trying to reopen in %d seconds...", secondsToWait)
				}

				time.Sleep(time.Duration(secondsToWait) * time.Second)

				err2 = s.openPublishChannel()
				if err2 != nil {
					err = err2
				} else {
					Logger.Info().Msg("reopened the publish channel")
					break
				}
			}

			if err2 != nil {
				panic(err2)
			}
		}
	}()

	return nil
}

func (s *service) publish(routingKey poeticmetric.QueueName, workName poeticmetric.WorkName, workParams any, publishParams *publishParams) error {
	var err error
	s.channelInitOnce.Do(func() {
		err = s.openPublishChannel()
	})
	if err != nil {
		return err
	}

	work := poeticmetric.Work[any]{
		Name:   workName,
		Params: workParams,
	}
	body, err := json.Marshal(work)
	if err != nil {
		return err
	}

	publishing := amqp.Publishing{
		Body:        body,
		ContentType: "application/json",
	}

	if publishParams != nil {
		if publishParams.Expiration != nil {
			publishing.Expiration = fmt.Sprintf("%d", publishParams.Expiration.Milliseconds())
		}

		if publishParams.Priority != nil {
			publishing.Priority = *publishParams.Priority
		}
	}

	err = s.channel.Publish("", string(routingKey), false, false, publishing)
	if err != nil {
		return err
	}

	return nil
}
