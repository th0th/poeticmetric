package middleware

import (
	"net/http"
	"time"

	"github.com/go-errors/errors"
	"github.com/valkey-io/valkey-go"
	"github.com/valkey-io/valkey-go/valkeylimiter"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func SensitiveRateLimit(responder poeticmetric.RestApiResponder, valkeyClient valkey.Client) func(handler http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			limiter, err := valkeylimiter.NewRateLimiter(valkeylimiter.RateLimiterOption{
				ClientBuilder: func(_ valkey.ClientOption) (valkey.Client, error) {
					return valkeyClient, nil
				},
				KeyPrefix: "rest_api_rate_limit_sensitive",
				Limit:     4,
				Window:    time.Minute,
			})
			if err != nil {
				responder.Error(w, errors.Wrap(err, 0))
				return
			}

			result, err := limiter.Allow(r.Context(), r.Header.Get("X-Forwarded-For"))
			if err != nil {
				responder.Error(w, errors.Wrap(err, 0))
				return
			}

			if !result.Allowed {
				responder.Detail(w, http.StatusTooManyRequests, "Rate limit reached. Please try again.")
				return
			}

			handler.ServeHTTP(w, r)
		})
	}
}
