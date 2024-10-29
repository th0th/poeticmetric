package root

import (
	"net/http"

	"github.com/th0th/unius-analytics/backend/pkg/analytics"
)

type Handler struct {
	envService analytics.EnvService
}

type NewParams struct {
	EnvService analytics.EnvService
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
