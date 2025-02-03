package poeticmetric

import (
	"net/http"
)

type RestApiResponder interface {
	Detail(w http.ResponseWriter, status int, detail string)
	Error(w http.ResponseWriter, err error)
	Forbidden(w http.ResponseWriter)
	JSON(w http.ResponseWriter, status int, data any)
	NotFound(w http.ResponseWriter)
	String(w http.ResponseWriter, contentType string, data []byte)
	Unauthorized(w http.ResponseWriter)
}
