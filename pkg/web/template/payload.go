package template

import (
	"context"
	"net/http"
)

const payloadContextKey = "payload"

type Data map[string]any

func AddDatum(r *http.Request, key string, value any) *http.Request {
	data := GetData(r)
	data[key] = value

	return r.WithContext(context.WithValue(r.Context(), payloadContextKey, data))
}

func GetData(r *http.Request) Data {
	rawData := r.Context().Value(payloadContextKey)
	if rawData == nil {
		return Data{}
	}

	return rawData.(Data)
}
