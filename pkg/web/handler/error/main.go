package error

import (
	"fmt"
	"net/http"

	"github.com/th0th/poeticmetric/pkg/web/template"
)

type Handler struct {
	template *template.Template
}

type NewParams struct {
	Template *template.Template
}

func New(params NewParams) *Handler {
	return &Handler{
		template: params.Template,
	}
}

func (h *Handler) Error(err error, w http.ResponseWriter, r *http.Request) {
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		//err2 := h.template.Render(w, "error", nil)
		//if err2 != nil {
		//	TODO: do something
		//}
	}
}
