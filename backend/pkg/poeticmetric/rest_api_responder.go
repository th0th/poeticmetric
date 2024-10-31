package poeticmetric

import (
	"net/http"
)

type RestApiResponder interface {
	Detail(w http.ResponseWriter, detail string)
	Error(w http.ResponseWriter, err error)
	Json(w http.ResponseWriter, data any)
	NotFound(w http.ResponseWriter)
}
