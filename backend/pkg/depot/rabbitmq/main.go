package rabbitmq

import (
	"context"
	"fmt"
	"log"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/th0th/poeticmetric/backend/pkg/env"
)

type QueueName string

type Queue struct {
	MaxPriority uint8
	Name        QueueName
	Ttl         time.Duration
}

type RabbitMq struct {
	connection     *amqp.Connection
	consumeChannel *amqp.Channel
	publishChannel *amqp.Channel
}

const deadLetterQueueTtl = 604800000

func New() *RabbitMq {
	return &RabbitMq{}
}

func (r *RabbitMq) Connection() *amqp.Connection {
	var err error

	if r.connection == nil {
		err = r.openConnection()
		if err != nil {
			panic(err)
		}
	}

	return r.connection
}

func (r *RabbitMq) Consume(queues []string, deliveryChannel chan<- amqp.Delivery) error {
	var err error

	for _, queue := range queues {
		queueDeliveries := make(<-chan amqp.Delivery)

		queueDeliveries, err = r.ConsumeChannel().Consume(queue, "", false, false, false, false, nil)
		if err != nil {
			return err
		}

		go func(deliveryChannel2 chan<- amqp.Delivery) {
			for delivery := range queueDeliveries {
				deliveryChannel2 <- delivery
			}
		}(deliveryChannel)
	}

	return nil
}

func (r *RabbitMq) ConsumeChannel() *amqp.Channel {
	var err error

	if r.consumeChannel == nil {
		err = r.openConsumeChannel()
		if err != nil {
			panic(err)
		}
	}

	return r.consumeChannel
}

func (r *RabbitMq) DeclareQueues(queues []*Queue) error {
	channel, err := r.Connection().Channel()
	if err != nil {
		return err
	}

	for _, queue := range queues {
		queueArgs := map[string]any{
			"x-dead-letter-exchange":    "",
			"x-dead-letter-routing-key": queue.getDeadLetterQueueName(),
		}

		if queue.MaxPriority != 0 {
			queueArgs["x-max-priority"] = queue.MaxPriority
		}

		if queue.Ttl != 0 {
			queueArgs["x-message-ttl"] = queue.Ttl.Milliseconds()
		}

		_, err = channel.QueueDeclare(
			string(queue.Name),
			true,
			false,
			false,
			false,
			queueArgs,
		)
		if err != nil {
			return err
		}

		// dead-letter queue
		_, err = channel.QueueDeclare(
			queue.getDeadLetterQueueName(),
			true,
			false,
			false,
			false,
			map[string]any{
				"x-message-ttl": deadLetterQueueTtl,
			},
		)
		if err != nil {
			return err
		}
	}

	return channel.Close()
}

func (r *RabbitMq) Publish(exchange string, key string, mandatory bool, immediate bool, msg amqp.Publishing) error {
	ctx := context.Background()

	return r.PublishChannel().PublishWithContext(ctx, exchange, key, mandatory, immediate, msg)
}

func (r *RabbitMq) PublishChannel() *amqp.Channel {
	var err error

	if r.publishChannel == nil {
		err = r.openPublishChannel()
		if err != nil {
			panic(err)
		}
	}

	return r.publishChannel
}

func (r *RabbitMq) openConnection() error {
	var err error

	r.connection, err = amqp.Dial(env.GetRabbitMqUrl())
	if err != nil {
		return err
	}

	r.setupConnectionCloseHandler()

	return nil
}

func (r *RabbitMq) openConsumeChannel() error {
	var err error

	r.consumeChannel, err = r.Connection().Channel()
	if err != nil {
		return err
	}

	err = r.consumeChannel.Qos(env.GetWorkerCount(), 0, false)
	if err != nil {
		return err
	}

	r.setupConsumeChannelCloseHandler()

	return nil
}

func (r *RabbitMq) openPublishChannel() error {
	var err error

	r.publishChannel, err = r.Connection().Channel()
	if err != nil {
		return err
	}

	r.setupPublishChannelCloseHandler()

	return nil
}

func (r *RabbitMq) setupConnectionCloseHandler() {
	go func() {
		var err error

		if <-r.Connection().NotifyClose(make(chan *amqp.Error)) != nil {
			retryCount := 0

			for retryCount < 3 {
				secondsToWait := retryCount + 1
				msg := fmt.Sprintf("RabbitMQ connection is closed. Trying to reconnect in %d seconds...", secondsToWait)

				if retryCount > 0 {
					msg = fmt.Sprintf("RabbitMQ connection is closed. Trying to reconnect in %d seconds... (%d)", secondsToWait, retryCount)
				}

				log.Println(msg)
				time.Sleep(time.Duration(retryCount+1) * time.Second)

				err = r.openConnection()
				if err == nil {
					return
				} else {
					log.Printf("an error has occurred: %v", err)
				}

				retryCount += 1
			}

			panic(err)
		}
	}()
}

func (r *RabbitMq) setupConsumeChannelCloseHandler() {
	go func() {
		var err error

		if <-r.consumeChannel.NotifyClose(make(chan *amqp.Error)) != nil {
			retryCount := 0

			for retryCount < 3 {
				secondsToWait := retryCount + 1
				msg := fmt.Sprintf("RabbitMQ consume channel is closed. Trying to reopen in %d seconds...", secondsToWait)

				if retryCount > 0 {
					msg = fmt.Sprintf("RabbitMQ consume channel is closed. Trying to reopen in %d seconds... (%d)", secondsToWait, retryCount)
				}

				log.Println(msg)
				time.Sleep(time.Duration(retryCount+1) * time.Second)

				err = r.openConsumeChannel()
				if err == nil {
					return
				} else {
					log.Printf("an error has occurred: %v", err)
				}

				retryCount += 1
			}

			panic(err)
		}
	}()
}

func (r *RabbitMq) setupPublishChannelCloseHandler() {
	go func() {
		var err error

		if <-r.publishChannel.NotifyClose(make(chan *amqp.Error)) != nil {
			retryCount := 0

			for retryCount < 3 {
				secondsToWait := retryCount + 1
				msg := fmt.Sprintf("RabbitMQ publish channel is closed. Trying to reopen in %d seconds...", secondsToWait)

				if retryCount > 0 {
					msg = fmt.Sprintf("RabbitMQ publish channel is closed. Trying to reopen in %d seconds... (%d)", secondsToWait, retryCount)
				}

				log.Println(msg)
				time.Sleep(time.Duration(retryCount+1) * time.Second)

				err = r.openPublishChannel()
				if err == nil {
					return
				} else {
					log.Printf("an error has occurred: %v", err)
				}

				retryCount += 1
			}

			panic(err)
		}
	}()
}

func (q *Queue) getDeadLetterQueueName() string {
	return fmt.Sprintf("%s.DL", q.Name)
}

func (q *Queue) getErrorQueueName() string {
	return fmt.Sprintf("%s.X", q.Name)
}
