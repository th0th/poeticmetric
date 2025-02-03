package responder

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"
	"github.com/rs/zerolog"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type DetailResponse struct {
	// Human-readable detail of the response.
	Detail string `json:"detail"`
}

type NewParams struct {
	EnvService poeticmetric.EnvService
}

type Responder struct {
	envService poeticmetric.EnvService
}

func New(params NewParams) poeticmetric.RestApiResponder {
	return &Responder{
		envService: params.EnvService,
	}
}

func (r *Responder) Detail(w http.ResponseWriter, status int, detail string) {
	r.JSON(w, status, DetailResponse{Detail: detail})
}

func (r *Responder) Error(w http.ResponseWriter, err error) {
	var validationErrs v.Errors
	if errors.As(err, &validationErrs) {
		validationErrMap := map[string]string{}
		for _, validationErr := range validationErrs {
			validationErrMap[validationErr.Field()] = validationErr.Message()
		}

		r.JSON(w, http.StatusUnprocessableEntity, validationErrMap)
		return
	}

	detail := "An error has occurred."

	if r.envService.Debug() {
		detail = err.Error()

		var wrappedErr *errors.Error
		if errors.As(err, &wrappedErr) {
			detail = fmt.Sprintf("%s\n%s", wrappedErr.Err.Error(), wrappedErr.ErrorStack())
		}
	}

	Logger.Err(err).Msg("an error has occurred")
	r.Detail(w, http.StatusInternalServerError, detail)
}

func (r *Responder) Forbidden(w http.ResponseWriter) {
	r.Detail(w, http.StatusForbidden, "You don't have enough permission.")
}

func (r *Responder) JSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		r.Error(w, err)
	}
}

func (r *Responder) NotFound(w http.ResponseWriter) {
	r.Detail(w, http.StatusNotFound, "Not found.")
}

func (r *Responder) String(w http.ResponseWriter, contentType string, data []byte) {
	w.Header().Set("Content-Type", contentType)
	_, err := w.Write(data)
	if err != nil {
		r.Error(w, err)
	}
}

func (r *Responder) Unauthorized(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
	r.Detail(w, http.StatusUnauthorized, "Invalid credentials.")
}

var Logger = zerolog.New(os.Stdout).With().Str("service", "responder").Timestamp().Logger()
