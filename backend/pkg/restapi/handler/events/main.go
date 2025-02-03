package events

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	eventService poeticmetric.EventService
	responder    poeticmetric.RestApiResponder
}

type NewParams struct {
	EventService poeticmetric.EventService
	Responder    poeticmetric.RestApiResponder
}

func New(params NewParams) Handler {
	return Handler{
		eventService: params.EventService,
		responder:    params.Responder,
	}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.CreateEventParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	params.DateTime = time.Now()
	params.IPAddress = r.RemoteAddr
	params.UserAgent = r.UserAgent()

	if params.ID == "" {
		params.ID = uuid.NewString()
	}

	err = h.eventService.Create(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.JSON(w, http.StatusAccepted, map[string]any{
		"id": params.ID,
	})
}
