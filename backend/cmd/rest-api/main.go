package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/justinas/alice"
	"github.com/rs/zerolog/hlog"
	"github.com/swaggo/http-swagger/v2"
	clickhouse2 "gorm.io/driver/clickhouse"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/unius-analytics/backend/cmd"
	"github.com/th0th/unius-analytics/backend/pkg/restapi/docs"
	bootstrap2 "github.com/th0th/unius-analytics/backend/pkg/restapi/handler/bootstrap"
	"github.com/th0th/unius-analytics/backend/pkg/restapi/handler/root"
	"github.com/th0th/unius-analytics/backend/pkg/restapi/middleware"
	responder2 "github.com/th0th/unius-analytics/backend/pkg/restapi/responder"
	"github.com/th0th/unius-analytics/backend/pkg/service/bootstrap"
	"github.com/th0th/unius-analytics/backend/pkg/service/env"
)

// @title Unius Analytics REST API
// @version 1.0
// @description This is a REST API for Unius Analytics.
// @termsOfService https://unius.sh/analytics/terms-of-service
func main() {
	// services
	envService, err := env.New()
	if err != nil {
		cmd.LogPanic(err, "failed to init env service")
	}

	postgres, err := gorm.Open(postgres2.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init postgres")
	}

	clickhouse, err := gorm.Open(clickhouse2.Open(envService.ClickhouseDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init postgres")
	}

	bootstrapService := bootstrap.New(bootstrap.NewParams{
		Clickhouse: clickhouse,
		EnvService: envService,
		Postgres:   postgres,
	})

	docs.SwaggerInfo.BasePath = envService.RestApiBasePath()

	responder := responder2.New(responder2.NewParams{
		EnvService: envService,
	})

	// handlers
	bootstrapHandler := bootstrap2.New(bootstrap2.NewParams{
		BootstrapService: bootstrapService,
		Responder:        responder,
	})

	rootHandler := root.New(root.NewParams{
		EnvService: envService,
	})

	mux := http.NewServeMux()

	// handlers: bootstrap
	mux.HandleFunc("GET /bootstrap", bootstrapHandler.Check)
	mux.HandleFunc("POST /bootstrap", bootstrapHandler.Run)

	// handlers: docs
	mux.Handle("/docs", http.RedirectHandler(fmt.Sprintf("%s/docs/", envService.RestApiBasePath()), http.StatusFound))
	mux.Handle("/docs/", httpSwagger.Handler(
		httpSwagger.DeepLinking(true),
		httpSwagger.Layout(httpSwagger.BaseLayout),
	))

	// handlers: root
	mux.HandleFunc("/{$}", rootHandler.Index())

	httpServer := http.Server{
		Handler: alice.New(
			middleware.BasePath(envService),
			hlog.NewHandler(cmd.Logger),
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
		).Then(mux),

		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	err = httpServer.ListenAndServe()
	if err != nil {
		cmd.LogPanic(err, "failed to start http server")
	}
}
