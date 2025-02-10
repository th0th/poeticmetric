package tracking

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	responder       poeticmetric.RestApiResponder
	trackingService poeticmetric.TrackingService
}

type NewParams struct {
	Responder       poeticmetric.RestApiResponder
	TrackingService poeticmetric.TrackingService
}

func New(params NewParams) Handler {
	return Handler{
		responder:       params.Responder,
		trackingService: params.TrackingService,
	}
}

func (h *Handler) Script(w http.ResponseWriter, r *http.Request) {
	trackerScript, err := h.trackingService.GetScript(r.Context())
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.String(w, "text/javascript", trackerScript)
}
