package worker

import (
	"bytes"
	"encoding/json"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"log"
	"strings"
)

const SendWebhookQueue rabbitmq.QueueName = "sendWebhook"

const (
	SendWebhookEventOrganizationDeleted Event = "organization.deleted"
)

type Event string

type SendWebhookPayload struct {
	Event Event
	Data  any
}

func SendWebhook(dp *depot.Depot, payload *SendWebhookPayload) error {
	if env.Get(env.NodeRedBaseUrl) == "" {
		return nil
	}

	return publish(dp, SendWebhookQueue, payload)
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

	_, err = dp.HttpClient().Post(env.Get(env.NodeRedBaseUrl)+"/webhook", "application/json", bytes.NewBuffer(bodyByteSlice))
	if err != nil {
		return err
	}

	return nil
}
