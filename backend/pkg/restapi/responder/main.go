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

func (r *Responder) Detail(w http.ResponseWriter, detail string) {
	r.JSON(w, DetailResponse{Detail: detail})
}

func (r *Responder) Error(w http.ResponseWriter, err error) {
	var validationErrs v.Errors
	if errors.As(err, &validationErrs) {
		validationErrMap := map[string]string{}
		for _, validationErr := range validationErrs {
			validationErrMap[validationErr.Field()] = validationErr.Message()
		}

		w.WriteHeader(http.StatusUnprocessableEntity)
		r.JSON(w, validationErrMap)
		return
	}

	w.WriteHeader(http.StatusInternalServerError)

	detail := "An error has occurred."

	if r.envService.Debug() {
		detail = err.Error()

		var wrappedErr *errors.Error
		if errors.As(err, &wrappedErr) {
			detail = fmt.Sprintf("%s\n%s", wrappedErr.Err.Error(), wrappedErr.ErrorStack())
		}
	}

	Logger.Err(err).Msg("an error has occurred")
	r.Detail(w, detail)
}

func (r *Responder) Forbidden(w http.ResponseWriter) {
	w.WriteHeader(http.StatusForbidden)
	r.Detail(w, "You don't have enough permission.")
}

func (r *Responder) JSON(w http.ResponseWriter, data any) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(data)
	if err != nil {
		r.Error(w, err)
	}
}

func (r *Responder) NotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	r.Detail(w, "Not found.")
}

func (r *Responder) Unauthorized(w http.ResponseWriter) {
	w.WriteHeader(http.StatusUnauthorized)
	w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
	r.Detail(w, "Invalid credentials.")
}

var Logger = zerolog.New(os.Stdout).With().Str("service", "responder").Timestamp().Logger()
