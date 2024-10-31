package middleware

import (
	"encoding/gob"
	"net/http"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

const sessionToastsKey = "toasts"

func AddSessionToast(w http.ResponseWriter, r *http.Request, sessionToast poeticmetric.WebSessionToast) error {
	session := GetSession(r)

	session.AddFlash(sessionToast, sessionToastsKey)

	return session.Save(r, w)
}

func GetSessionToasts(w http.ResponseWriter, r *http.Request) ([]poeticmetric.WebSessionToast, error) {
	session := GetSession(r)

	flashes := session.Flashes(sessionToastsKey)
	err := session.Save(r, w)
	if err != nil {
		return nil, err
	}

	toasts := make([]poeticmetric.WebSessionToast, 0, len(flashes))
	for _, flash := range flashes {
		toasts = append(toasts, flash.(poeticmetric.WebSessionToast))
	}

	return toasts, nil
}

func init() {
	gob.Register(poeticmetric.WebSessionToast{})
}
