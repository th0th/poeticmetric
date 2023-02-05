package worker

import (
	"encoding/json"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/th0th/poeticmetric/backend/pkg/service/event"
)

const CreateEventQueue rabbitmq.QueueName = "createEvent"

type CreateEventPayload = event.CreatePayload

func CreateEvent(dp *depot.Depot, payload *CreateEventPayload) error {
	return publish(dp, CreateEventQueue, payload)
}

func createEvent(dp *depot.Depot, b []byte) error {
	payload := &CreateEventPayload{}

	err := json.Unmarshal(b, payload)
	if err != nil {
		return err
	}

	err = event.Create(dp, payload)
	if err != nil {
		return err
	}

	return nil
}
