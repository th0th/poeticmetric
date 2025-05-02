package middleware

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-errors/errors"
	"github.com/valkey-io/valkey-go"
	"github.com/valkey-io/valkey-go/valkeylimiter"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type RateLimitParams struct {
	KeyPrefix    string
	Limit        int
	Responder    poeticmetric.RestApiResponder
	ValkeyClient valkey.Client
	Window       time.Duration
}

func RateLimit(params RateLimitParams) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			limiter, err := valkeylimiter.NewRateLimiter(valkeylimiter.RateLimiterOption{
				ClientBuilder: func(_ valkey.ClientOption) (valkey.Client, error) {
					return params.ValkeyClient, nil
				},
				KeyPrefix: fmt.Sprintf("rest_api_rate_limit_%s", params.KeyPrefix),
				Limit:     params.Limit,
				Window:    params.Window,
			})
			if err != nil {
				params.Responder.Error(w, errors.Wrap(err, 0))
				return
			}

			result, err := limiter.Allow(r.Context(), r.Header.Get("X-Forwarded-For"))
			if err != nil {
				params.Responder.Error(w, errors.Wrap(err, 0))
				return
			}

			if !result.Allowed {
				params.Responder.Detail(w, http.StatusTooManyRequests, "Rate limit reached. Please wait for a while, and then try again.")
				return
			}

			handler.ServeHTTP(w, r)
		})
	}
}
