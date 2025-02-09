package poeticmetric

import (
	"context"
	"encoding/json"
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

const (
	QueueDefaultName QueueName = "default"
)

const (
	WorkCreateEvent WorkName = "CreateEvent"
)

type Queue struct {
	Args       amqp.Table
	IsConsumed bool
	Name       QueueName
}

type QueueName string

type Work[T any] struct {
	Name   WorkName
	Params T
}

type WorkName string

type WorkPublisher interface {
	CreateEvent(ctx context.Context, params *CreateEventParams) error
}

type Worker interface{
	Run(ctx context.Context) error
}

func DeclareQueues(rabbitMq *amqp.Connection) error {
	channel, err := rabbitMq.Channel()
	if err != nil {
		return err
	}
	defer func() {
		err = channel.Close()
	}()

	for _, queue := range Queues(true) {
		args := amqp.Table{
			"x-dead-letter-exchange":    "",
			"x-dead-letter-routing-key": queue.GetDeadLetterQueueName(),
		}
		for k, v := range queue.Args {
			args[k] = v
		}

		_, err = channel.QueueDeclare(string(queue.Name), true, false, false, false, args)
		if err != nil {
			return err
		}

		// dead-letter queue
		_, err = channel.QueueDeclare(queue.GetDeadLetterQueueName(), true, false, false, false, nil)
		if err != nil {
			return err
		}
	}

	return err
}

func GetWorkParams[T any](deliveryBody []byte) (T, error) {
	work := Work[T]{}
	err := json.Unmarshal(deliveryBody, &work)
	return work.Params, err
}

func Queues(includeNonConsumed bool) map[QueueName]Queue {
	qs := map[QueueName]Queue{}
	for _, q := range queues {
		if !includeNonConsumed && !q.IsConsumed {
			continue
		}

		qs[q.Name] = q
	}

	return qs
}

func (q *Queue) GetDeadLetterQueueName() string {
	return fmt.Sprintf("%s.DL", q.Name)
}

var queues = map[QueueName]Queue{
	QueueDefaultName: {
		IsConsumed: true,
		Name:       QueueDefaultName,
	},
}
