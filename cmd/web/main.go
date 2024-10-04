package main

import (
	"net/http"
	"time"

	"github.com/go-errors/errors"
	"github.com/gorilla/csrf"
	"github.com/gorilla/sessions"
	"github.com/justinas/alice"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog/log"
	clickhouse2 "gorm.io/driver/clickhouse"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/cmd"
	"github.com/th0th/poeticmetric/pkg/service/env"
	"github.com/th0th/poeticmetric/pkg/web/fileserver"
	"github.com/th0th/poeticmetric/pkg/web/handler/authentication"
	error2 "github.com/th0th/poeticmetric/pkg/web/handler/error"
	"github.com/th0th/poeticmetric/pkg/web/handler/root"
	"github.com/th0th/poeticmetric/pkg/web/middleware"
	template2 "github.com/th0th/poeticmetric/pkg/web/template"
)

func logPanic(err error, message string) {
	log.Panic().Stack().Err(errors.Wrap(err, 0)).Msg(message)
}

func main() {
	envService, err := env.New()
	if err != nil {
		logPanic(errors.Wrap(err, 0), "failed to initiate env service")
	}

	// postgres
	_, err = gorm.Open(postgres2.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		logPanic(errors.Wrap(err, 0), "postgres initialization failed")
	}

	// clickhouse
	_, err = gorm.Open(clickhouse2.Open(envService.ClickhouseDsn()), envService.GormConfig())
	if err != nil {
		logPanic(errors.Wrap(err, 0), "clickhouse initialization failed")
	}

	// redis
	_ = redis.NewClient(&redis.Options{
		Addr:     envService.RedisAddr(),
		Password: envService.Vars().RedisPassword,
	})

	sessionStore := sessions.NewCookieStore([]byte(envService.SecretKey()))
	sessionStore.MaxAge(60 * 60 * 24 * 7)

	mux := http.NewServeMux()

	template, err := template2.New(template2.NewParams{
		EnvService: envService,
	})
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to initiate template")
	}

	fileServer, err := fileserver.New()
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to initiate file server")
	}

	errorHandler := error2.New(error2.NewParams{
		Template: template,
	})

	mainHandler := root.New(root.NewParams{
		ErrorHandler: errorHandler,
		Template:     template,
	})

	authenticationHandler := authentication.New(authentication.NewParams{
		ErrorHandler: errorHandler,
		Template:     template,
	})

	mux.Handle("/", fileServer)
	mux.HandleFunc("/{$}", mainHandler.Home)
	mux.HandleFunc("/manifesto", mainHandler.Manifesto)
	mux.HandleFunc("/sign-in", authenticationHandler.SignIn)

	httpServer := http.Server{
		Addr: ":80",
		Handler: alice.New(
			middleware.Session(sessionStore),
			csrf.Protect(
				[]byte(envService.SecretKey()),
				csrf.FieldName("csrf_token"),
				csrf.CookieName("csrf"),
			),
		).Then(mux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	err = httpServer.ListenAndServe()
	if err != nil {
		cmd.LogPanic(errors.Wrap(err, 0), "failed to start http server")
	}
}
