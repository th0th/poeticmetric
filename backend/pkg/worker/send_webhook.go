package worker

import (
	"bytes"
	"encoding/json"
	"log"
	"strings"

	"github.com/getsentry/sentry-go"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/th0th/poeticmetric/backend/pkg/env"
)

const SendWebhookQueue rabbitmq.QueueName = "sendWebhook"

const (
	SendWebhookEventOrganizationDeleted Event = "organization.deleted"
	SendWebhookEventUserSignedUp        Event = "user.signed_up"
)

type Event string

type SendWebhookPayload struct {
	Data  map[string]any
	Event Event
}

func SendWebhook(dp *depot.Depot, payload *SendWebhookPayload) {
	if env.Get(env.WebhookUrl) == "" {
		return
	}

	err := publish(dp, SendWebhookQueue, payload)
	if err != nil {
		sentry.WithScope(func(scope *sentry.Scope) {
			scope.SetContext("payload", sentry.Context{
				"Data":  payload.Data,
				"Event": payload.Event,
			})

			sentry.CaptureException(err)
		})
	}
}

func sendWebhook(dp *depot.Depot, b []byte) error {
	payload := &SendWebhookPayload{}

	err := json.Unmarshal(b, payload)
	if err != nil {
		return err
	}

	log.Printf("Delivering webhook for event '%s'", payload.Event)

	rawDataByteSlice, err := json.Marshal(payload.Data)
	if err != nil {
		return err
	}

	rawDataMap := map[string]any{}

	err = json.Unmarshal(rawDataByteSlice, &rawDataMap)
	if err != nil {
		return err
	}

	dataMap := map[string]any{}

	for k, v := range rawDataMap {
		dataMap[strings.ToLower(k[0:1])+k[1:]] = v
	}

	bodyData := map[string]any{
		"data":  dataMap,
		"event": payload.Event,
	}

	bodyByteSlice, err := json.Marshal(bodyData)
	if err != nil {
		return err
	}

	_, err = dp.HttpClient().Post(env.Get(env.WebhookUrl), "application/json", bytes.NewBuffer(bodyByteSlice))
	if err != nil {
		return err
	}

	return nil
}
