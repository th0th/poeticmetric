package root

import (
	_ "embed"
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

func (h *Handler) Home(w http.ResponseWriter, r *http.Request) {
	err := h.template.RenderHtml(w, r, "home", nil)
	if err != nil {
		h.errorHandler.Error(err, w, r)
	}
}

func (h *Handler) Manifesto(w http.ResponseWriter, r *http.Request) {
	data := template.Data{
		"Manifesto": manifesto,
	}

	err := h.template.RenderHtml(w, r, "manifesto", data)
	if err != nil {
		h.errorHandler.Error(err, w, r)
	}
}

//go:embed files/manifesto.md
var manifesto string
