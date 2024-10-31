package middleware

import (
	"context"
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/wader/gormstore/v2"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

const sessionKey sessionRequestContextKey = "session"

type sessionRequestContextKey string

func GetSession(r *http.Request) *sessions.Session {
	return r.Context().Value(sessionKey).(*sessions.Session)
}

func Session(store *gormstore.Store, errorHandler poeticmetric.WebErrorHandler) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session, err := store.Get(r, "s")
			if err != nil {
				errorHandler.Error(w, r, err)
				return
			}

			r = r.WithContext(context.WithValue(r.Context(), sessionKey, session))

			handler.ServeHTTP(w, r)
		})
	}
}
