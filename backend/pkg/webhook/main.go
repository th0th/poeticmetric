package webhook

import (
	"bytes"
	"encoding/json"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"net/http"
	"strings"
	"time"
)

const (
	EventOrganizationDeleted Event = "organization.deleted"
)

type Event string

type Payload = any

type data struct {
	Event   Event   `json:"event"`
	Payload Payload `json:"payload"`
}

var client = &http.Client{
	Timeout: 10 * time.Second,
}

func Send(event Event, payload Payload) {
	if env.Get(env.WebhookUrl) == "" {
		return
	}

	payloadMap := map[string]any{}
	payload2 := map[string]any{}

	payloadJson, err := json.Marshal(payload)
	if err != nil {
		panic(err)
	}

	err = json.Unmarshal(payloadJson, &payloadMap)

	for k, v := range payloadMap {
		payload2[strings.ToLower(k[0:1]) + k[1:]] = v
	}

	d := &data{
		Event:   event,
		Payload: payload2,
	}

	dataByteSlice, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}

	res, err := client.Post(env.Get(env.WebhookUrl), "application/json", bytes.NewBuffer(dataByteSlice))
	if err != nil {
		panic(err)
	}

	if res != nil {

	}
}
