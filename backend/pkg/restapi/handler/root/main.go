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
		basePath := "/"

		restAPIBasePath := h.envService.RESTApiBasePath()
		if restAPIBasePath != nil {
			basePath = *restAPIBasePath
		}

		http.Redirect(w, r, basePath, http.StatusFound)
	}
}
