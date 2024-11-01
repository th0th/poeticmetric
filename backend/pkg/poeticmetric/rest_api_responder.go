package poeticmetric

import (
	"net/http"
)

type RestApiResponder interface {
	Detail(w http.ResponseWriter, detail string)
	Error(w http.ResponseWriter, err error)
	Forbidden(w http.ResponseWriter)
	Json(w http.ResponseWriter, data any)
	NotFound(w http.ResponseWriter)
	Unauthorized(w http.ResponseWriter)
}
