package middleware

import (
	"net/http"

	"github.com/gorilla/sessions"
)

func Session(store sessions.Store) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get a session. We're ignoring the error resulted from decoding an
			// existing session: Get() always returns a session, even if empty.
			session, _ := store.Get(r, "s")
			// Set some session values.
			session.Values["foo2"] = "bar2"
			session.Values[42] = 43
			// Save it before we write to the response/return from the handler.
			err := session.Save(r, w)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			r = r.WithContext(r.Context())
			handler.ServeHTTP(w, r)
		})
	}
}
