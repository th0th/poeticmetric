package bootstrap

import (
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	bootstrapService poeticmetric.BootstrapService
	responder        poeticmetric.RestApiResponder
}

type NewParams struct {
	BootstrapService poeticmetric.BootstrapService
	Responder        poeticmetric.RestApiResponder
}

func New(params NewParams) *Handler {
	return &Handler{
		bootstrapService: params.BootstrapService,
		responder:        params.Responder,
	}
}

// Check godoc
// @Description check if the bootstrap process is already done
// @Failure 400 {object} responder.DetailResponse
// @Router /bootstrap [get]
// @Success 200
// @Summary Check bootstrap status
// @Tags boostrap
func (h *Handler) Check(w http.ResponseWriter, r *http.Request) {
	err := h.bootstrapService.Check(r.Context())
	if err != nil {
		if errors.Is(err, poeticmetric.BootstrapServiceErrAlreadyDone) {
			w.WriteHeader(http.StatusBadRequest)
			h.responder.Detail(w, "Bootstrap is already done.")
			return
		}

		h.responder.Error(w, err)
		return
	}

	h.responder.Detail(w, "Ready to go.")
}

// Run godoc
// @Description check if the bootstrap process is already done
// @Param params body poeticmetric.BootstrapServiceRunParams true "Params"
// @Router /bootstrap [post]
// @Success 201
// @Summary Run bootstrap
// @Tags boostrap
func (h *Handler) Run(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.BootstrapServiceRunParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	_, err = h.bootstrapService.Run(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
}
