package root

import (
	_ "embed"
	"net/http"

	"github.com/gorilla/schema"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/pkg/web/middleware"
	"github.com/th0th/poeticmetric/pkg/web/template"
)

type Handler struct {
	bootstrapService poeticmetric.BootstrapService
	decoder          *schema.Decoder
	errorHandler     poeticmetric.WebErrorHandler
	template         *template.Template
}

type NewParams struct {
	BootstrapService poeticmetric.BootstrapService
	Decoder          *schema.Decoder
	ErrorHandler     poeticmetric.WebErrorHandler
	Template         *template.Template
}

func New(params NewParams) *Handler {
	return &Handler{
		bootstrapService: params.BootstrapService,
		decoder:          params.Decoder,
		errorHandler:     params.ErrorHandler,
		template:         params.Template,
	}
}

func (h *Handler) Bootstrap(w http.ResponseWriter, r *http.Request) {
	isDone, err := h.bootstrapService.Done(r.Context())
	if err != nil {
		h.errorHandler.Error(w, r, err)
		return
	}
	if isDone {
		err = middleware.AddSessionToast(w, r, poeticmetric.WebSessionToast{
			Message: "Bootstrap is already done.",
			Variant: poeticmetric.WebSessionToastVariantDanger,
		})
		if err != nil {
			h.errorHandler.Error(w, r, err)
			return
		}

		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	data := poeticmetric.WebTemplateData{}

	if r.Method == http.MethodPost {
		err = r.ParseForm()
		if err != nil {
			h.errorHandler.Error(w, r, err)
			return
		}

		postData := poeticmetric.BootstrapServiceRunParams{}
		err = h.decoder.Decode(&postData, r.PostForm)
		if err != nil {
			h.errorHandler.Error(w, r, err)
			return
		}

		data["PostData"] = postData

		_, err = h.bootstrapService.Run(r.Context(), &postData)
		if err != nil {
			if h.errorHandler.Process(w, r, data, err) {
				return
			}
		}
	}

	err = h.template.RenderHtml(w, r, "bootstrap", data)
	if err != nil {
		h.errorHandler.Error(w, r, err)
	}
}

func (h *Handler) Home(w http.ResponseWriter, r *http.Request) {
	err := h.template.RenderHtml(w, r, "home", nil)
	if err != nil {
		h.errorHandler.Error(w, r, err)
	}
}

func (h *Handler) Manifesto(w http.ResponseWriter, r *http.Request) {
	data := poeticmetric.WebTemplateData{
		"Manifesto": manifesto,
	}

	err := h.template.RenderHtml(w, r, "manifesto", data)
	if err != nil {
		h.errorHandler.Error(w, r, err)
	}
}

//go:embed files/manifesto.md
var manifesto string
