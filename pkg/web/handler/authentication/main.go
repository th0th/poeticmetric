package authentication

import (
	"net/http"

	error2 "github.com/th0th/poeticmetric/pkg/web/handler/error"
	"github.com/th0th/poeticmetric/pkg/web/template"
)

type Handler struct {
	errorHandler *error2.Handler
	template     *template.Template
}

type NewParams struct {
	ErrorHandler *error2.Handler
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
		h.errorHandler.Error(err, w, r)
	}
}
