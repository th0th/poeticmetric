package poeticmetric

import (
	"net/http"
)

type WebErrorHandler interface {
	Error(w http.ResponseWriter, r *http.Request, err error)
	Process(w http.ResponseWriter, r *http.Request, data WebTemplateData, err error) bool
}
