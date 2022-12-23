package worker

import (
	"encoding/json"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/signal"
	amqp "github.com/rabbitmq/amqp091-go"
	"log"
)

var Queues = []*rabbitmq.Queue{
	{Name: SendWebhookQueue},
}

func Run(dp *depot.Depot, queues []string) error {
	err := dp.RabbitMq().DeclareQueues(Queues)
	if err != nil {
		return err
	}

	log.Println("Queues:")

	for _, q := range queues {
		log.Printf("* %s", q)
	}

	log.Println("Starting to listen...")

	runners := map[rabbitmq.QueueName]func(*depot.Depot, []byte) error{
		SendWebhookQueue: sendWebhook,
	}

	deliveries := make(chan amqp.Delivery)

	err = dp.RabbitMq().Consume(queues, deliveries)
	if err != nil {
		panic(err)
	}

	go func() {
		for delivery := range deliveries {
			err2 := runners[rabbitmq.QueueName(delivery.RoutingKey)](dp, delivery.Body)
			if err2 != nil {
				// TODO: handle error
				panic(err2)
			}

			err2 = delivery.Ack(false)
			if err2 != nil {
				panic(err2)
			}
		}
	}()

	signal.ExitWithSignal()

	return nil
}

func publish(dp *depot.Depot, queue rabbitmq.QueueName, payload any) error {
	publishingBody, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	publishing := amqp.Publishing{
		Body:        publishingBody,
		ContentType: "application/json",
	}

	return dp.RabbitMq().Publish("", string(queue), false, false, publishing)
}
