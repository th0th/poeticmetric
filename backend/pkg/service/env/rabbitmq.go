package env

import (
	"fmt"
)

func (s *service) RabbitMqURL() string {
	return fmt.Sprintf(
		"amqp://%s:%s@%s:%d/%s",
		s.vars.RabbitMqUser,
		s.vars.RabbitMqPassword,
		s.vars.RabbitMqHost,
		s.vars.RabbitMqPort,
		s.vars.RabbitMqVhost,
	)
}
