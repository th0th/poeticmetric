package authentication

import (
	"net/http"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/pkg/web/template"
)

type Handler struct {
	errorHandler poeticmetric.WebErrorHandler
	template     *template.Template
}

type NewParams struct {
	ErrorHandler poeticmetric.WebErrorHandler
	Template     *template.Template
}

func New(params NewParams) *Handler {
	return &Handler{
		errorHandler: params.ErrorHandler,
		template:     params.Template,
	}
}

func (h *Handler) SignIn(w http.ResponseWriter, r *http.Request) {
	err := h.template.RenderHtml(w, r, "sign-in", nil)
	if err != nil {
		h.errorHandler.Error(w, r, err)
	}
}
