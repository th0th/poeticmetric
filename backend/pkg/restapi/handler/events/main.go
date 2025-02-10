package events

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-errors/errors"
	"github.com/google/uuid"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	eventService      poeticmetric.EventService
	responder         poeticmetric.RestApiResponder
	validationService poeticmetric.ValidationService
	workPublisher     poeticmetric.WorkPublisher
}

type NewParams struct {
	EventService      poeticmetric.EventService
	Responder         poeticmetric.RestApiResponder
	ValidationService poeticmetric.ValidationService
	WorkPublisher     poeticmetric.WorkPublisher
}

func New(params NewParams) Handler {
	return Handler{
		eventService:      params.EventService,
		responder:         params.Responder,
		validationService: params.ValidationService,
		workPublisher:     params.WorkPublisher,
	}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.CreateEventParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.validationService.CreateEventParams(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	params.DateTime = time.Now()
	params.IPAddress = r.Header.Get("X-Forwarded-For")
	params.UserAgent = r.UserAgent()

	if params.ID == "" {
		params.ID = uuid.NewString()
	}

	err = h.workPublisher.CreateEvent(r.Context(), &params)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		h.responder.Error(w, err)
		return
	}

	h.responder.JSON(w, http.StatusAccepted, map[string]any{
		"id": params.ID,
	})
}
