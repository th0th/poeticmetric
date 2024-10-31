package responder

import (
	"encoding/json"
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
	r.Json(w, DetailResponse{Detail: detail})
}

func (r *Responder) Error(w http.ResponseWriter, err error) {
	var validationErrors v.Errors
	if errors.As(err, &validationErrors) {
		validationErrMap := map[string]string{}
		for _, validationError := range validationErrors {
			validationErrMap[validationError.Field()] = validationError.Message()
		}

		w.WriteHeader(http.StatusUnprocessableEntity)
		r.Json(w, validationErrMap)
		return
	}

	w.WriteHeader(http.StatusInternalServerError)

	detail := "An error has occurred."
	if r.envService.Debug() {
		detail = err.Error()
	}

	Logger.Err(err).Msg("an error has occurred")
	r.Json(w, map[string]string{"detail": detail})
}

func (r *Responder) Json(w http.ResponseWriter, data any) {
	j, err := json.Marshal(data)
	if err != nil {
		r.Error(w, err)
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(j)
	if err != nil {
		r.Error(w, err)
	}
}

func (r *Responder) NotFound(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNotFound)
	r.Json(w, map[string]string{"detail": "Not found."})
}

var Logger = zerolog.New(os.Stdout).With().Str("service", "responder").Timestamp().Logger()
