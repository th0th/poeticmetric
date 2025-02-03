package middleware

import (
	"net/http"

	"github.com/ulule/limiter/v3"
	"github.com/ulule/limiter/v3/drivers/middleware/stdlib"

	"github.com/th0th/poeticmetric/backend/cmd"
	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func SensitiveRateLimit(responder poeticmetric.RestApiResponder, store limiter.Store) func(handler http.Handler) http.Handler {
	limiterSensitiveRate, err := limiter.NewRateFromFormatted("4-M")
	if err != nil {
		cmd.LogPanic(err, "failed to init limiter sensitive rate")
	}

	limiterSensitiveMiddleware := stdlib.NewMiddleware(
		limiter.New(
			store,
			limiterSensitiveRate,
			limiter.WithTrustForwardHeader(true),
		),
		stdlib.WithErrorHandler(func(w http.ResponseWriter, r *http.Request, err error) {
			responder.Error(w, err)
		}),
		stdlib.WithLimitReachedHandler(func(w http.ResponseWriter, r *http.Request) {
			responder.Detail(w, http.StatusTooManyRequests, "Rate limit reached. Please wait a bit and try again.")
		}),
	)

	return limiterSensitiveMiddleware.Handler
}
