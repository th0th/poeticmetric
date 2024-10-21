package main

import (
	"net/http"
	"os"
	"time"

	"github.com/justinas/alice"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/hlog"

	"github.com/th0th/unius-analytics/backend/pkg/restapi/handler/root"
	"github.com/th0th/unius-analytics/backend/pkg/service/env"
)

// @title Unius Analytics REST API
// @version 1.0
// @description This is a REST API for Unius Analytics.
// @termsOfService https://unius.sh/analytics/terms-of-service
func main() {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	// services
	envService, err := env.New()
	if err != nil {
		logger.Panic().Stack().Err(err).Msg("failed to init env service")
	}

	// handlers
	rootHandler := root.New(root.NewParams{
		EnvService: envService,
	})

	mux := http.NewServeMux()

	mux.HandleFunc("/", rootHandler.Index())

	httpServer := http.Server{
		Handler: alice.New(
			hlog.NewHandler(logger),
			hlog.AccessHandler(func(r *http.Request, status, size int, duration time.Duration) {
				hlog.FromRequest(r).Info().
					Str("method", r.Method).
					Stringer("url", r.URL).
					Int("status", status).
					Int("size", size).
					Dur("duration", duration).
					Msg("")
			}),
			hlog.RemoteIPHandler("ip"),
			hlog.CustomHeaderHandler("sessionID", "Session-ID"),
		).Then(mux),

		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	err = httpServer.ListenAndServe()
	if err != nil {
		logger.Panic().Stack().Err(err).Msg("failed to start http server")
	}
}
