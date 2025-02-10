package workpublisher

import (
	"os"
	"sync"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	RabbitMQ *amqp.Connection
}

type publishParams struct {
	Expiration *time.Duration
	Priority   *uint8
}

type service struct {
	channel         *amqp.Channel
	channelInitOnce sync.Once
	rabbitMQ        *amqp.Connection
}

func New(params NewParams) poeticmetric.WorkPublisher {
	return &service{
		rabbitMQ: params.RabbitMQ,
	}
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
