package middleware

import (
	"fmt"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/rs/zerolog"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func Recover(
	envService poeticmetric.EnvService,
	responder poeticmetric.RestApiResponder,
	logger zerolog.Logger,
) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				err := recover()
				if err != nil {
					logger.Error().Stack().Err(errors.Wrap(err, 0)).Send()

					if envService.Debug() {
						w.WriteHeader(http.StatusInternalServerError)
						w.Header().Set("Content-Type", "text/plain; charset=utf-8")

						wrappedErr := errors.Wrap(err, 0)
						_, err2 := fmt.Fprintf(w, "%s\n%s", wrappedErr.Err.Error(), wrappedErr.ErrorStack())
						if err2 != nil {
							logger.Error().Stack().Err(errors.Wrap(err2, 0)).Send()
						}
					} else {
						responder.Detail(w, http.StatusInternalServerError, "An error has occurred.")
					}
				}
			}()

			handler.ServeHTTP(w, r)
		})
	}
}
