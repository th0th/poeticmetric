package middleware

import (
	"net/http"
)

func BasePathHandler(restAPIBasePath *string) func(handler http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		if restAPIBasePath != nil {
			return http.StripPrefix(*restAPIBasePath, handler)
		}

		return handler
	}
}
