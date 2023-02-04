package depot

import "github.com/th0th/poeticmetric/backend/pkg/depot/rabbitmq"

func (dp *Depot) RabbitMq() *rabbitmq.RabbitMq {
	if dp.rabbitMq == nil {
		dp.rabbitMq = rabbitmq.New()
	}

	return dp.rabbitMq
}
