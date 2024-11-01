package root

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type Handler struct {
	envService poeticmetric.EnvService
}

type NewParams struct {
	EnvService poeticmetric.EnvService
}

func New(params NewParams) Handler {
	return Handler{
		envService: params.EnvService,
	}
}

func (h *Handler) Index() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, h.envService.RestApiBasePath(), http.StatusFound)
	}
}
