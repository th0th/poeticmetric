package worker

import (
	"encoding/json"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/email"
)

const SendEmailQueue rabbitmq.QueueName = "sendEmail"

type SendEmailPayload = email.SendInput

func SendEmail(dp *depot.Depot, payload *SendEmailPayload) error {
	return publish(dp, SendEmailQueue, payload)
}

func sendEmail(dp *depot.Depot, b []byte) error {
	payload := &SendEmailPayload{}

	err := json.Unmarshal(b, payload)
	if err != nil {
		return err
	}

	err = email.Send(payload)
	if err != nil {
		return err
	}

	return nil
}
