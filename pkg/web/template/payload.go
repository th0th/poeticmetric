package template

import (
	"context"
	"net/http"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

const payloadContextKey = "payload"

func AddDatum(r *http.Request, key string, value any) *http.Request {
	data := GetData(r)
	data[key] = value

	return r.WithContext(context.WithValue(r.Context(), payloadContextKey, data))
}

func GetData(r *http.Request) poeticmetric.WebTemplateData {
	rawData := r.Context().Value(payloadContextKey)
	if rawData == nil {
		return poeticmetric.WebTemplateData{}
	}

	return rawData.(poeticmetric.WebTemplateData)
}
