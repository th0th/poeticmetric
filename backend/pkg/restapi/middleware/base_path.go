package middleware

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/analytics"
)

func BasePath(envService analytics.EnvService) func(handler http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.StripPrefix(envService.RestApiBasePath(), handler)
	}
}
