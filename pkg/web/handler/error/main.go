package error

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/RussellLuo/validating/v3"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/pkg/web/template"
)

type Handler struct {
	template *template.Template
}

type NewParams struct {
	Template *template.Template
}

func New(params NewParams) poeticmetric.WebErrorHandler {
	return &Handler{
		template: params.Template,
	}
}

func (h *Handler) Error(w http.ResponseWriter, r *http.Request, err error) {
	if err != nil {
		fmt.Println(err)
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		//err2 := h.template.Render(w, "error", nil)
		//if err2 != nil {
		//	TODO: do something
		//}
	}
}

func (h *Handler) Process(w http.ResponseWriter, r *http.Request, data poeticmetric.WebTemplateData, err error) bool {
	var validationErrs validating.Errors
	if errors.As(err, &validationErrs) {
		dataErrors := map[string]string{}
		for _, validationErr := range validationErrs {
			dataErrors[validationErr.Field()] = validationErr.Message()
		}
		data["Errors"] = dataErrors

		return false
	}

	http.Error(w, "Something went wrong", http.StatusInternalServerError)
	return true
}
