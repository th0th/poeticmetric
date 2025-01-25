package main

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/justinas/alice"
	goredis "github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/hlog"
	httpswagger "github.com/swaggo/http-swagger/v2"
	limiterredis "github.com/ulule/limiter/v3/drivers/store/redis"
	gormclickhouse "gorm.io/driver/clickhouse"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/cmd"
	"github.com/th0th/poeticmetric/backend/pkg/lib/log"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/docs"
	authenticationhandler "github.com/th0th/poeticmetric/backend/pkg/restapi/handler/authentication"
	bootstraphandler "github.com/th0th/poeticmetric/backend/pkg/restapi/handler/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/root"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/sites"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/users"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
	restapiresponder "github.com/th0th/poeticmetric/backend/pkg/restapi/responder"
	"github.com/th0th/poeticmetric/backend/pkg/service/authentication"
	"github.com/th0th/poeticmetric/backend/pkg/service/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/service/email"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
	"github.com/th0th/poeticmetric/backend/pkg/service/user"
	"github.com/th0th/poeticmetric/backend/pkg/service/validation"
)

var ctx = context.Background()

// @description This is a REST API for PoeticMetric.
// @termsOfService https://poeticmetric.com/terms-of-service
// @title PoeticMetric REST API
// @version 1.0

// @securityDefinitions.basic BasicAuthentication

// @securityDefinitions.apiKey UserAccessTokenAuthentication
// @description User access token authentication.
// @in header
// @name authorization
func main() {
	zerolog.ErrorStackMarshaler = log.MarshalStack

	// services
	envService, err := env.New()
	if err != nil {
		cmd.LogPanic(err, "failed to init env service")
	}

	docs.SwaggerInfo.BasePath = envService.RestApiBasePath()

	postgres, err := gorm.Open(gormpostgres.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init postgres")
	}

	clickhouse, err := gorm.Open(gormclickhouse.Open(envService.ClickhouseDsn()), envService.GormConfig())
	if err != nil {
		cmd.LogPanic(err, "failed to init postgres")
	}

	redis := goredis.NewClient(&goredis.Options{
		Addr:     envService.RedisAddr(),
		Password: envService.RedisPassword(),
	})
	err = redis.Ping(ctx).Err()
	if err != nil {
		cmd.LogPanic(err, "failed to ping redis")
	}

	validationService := validation.New(validation.NewParams{
		EnvService: envService,
		Postgres:   postgres,
	})

	emailService, err := email.New(email.NewParams{
		EnvService: envService,
	})
	if err != nil {
		cmd.LogPanic(err, "failed to init email service")
	}

	authenticationService := authentication.New(authentication.NewParams{
		EmailService:      emailService,
		Postgres:          postgres,
		ValidationService: validationService,
	})

	bootstrapService := bootstrap.New(bootstrap.NewParams{
		Clickhouse: clickhouse,
		EnvService: envService,
		Postgres:   postgres,
	})

	siteService := site.New(site.NewParams{
		Postgres:          postgres,
		ValidationService: validationService,
	})

	userService := user.New(user.NewParams{
		EmailService:      emailService,
		Postgres:          postgres,
		ValidationService: validationService,
	})

	responder := restapiresponder.New(restapiresponder.NewParams{
		EnvService: envService,
	})

	// handlers
	authenticationHandler := authenticationhandler.New(authenticationhandler.NewParams{
		AuthenticationService: authenticationService,
		Responder:             responder,
	})

	bootstrapHandler := bootstraphandler.New(bootstraphandler.NewParams{
		BootstrapService: bootstrapService,
		Responder:        responder,
	})

	rootHandler := root.New(root.NewParams{
		EnvService: envService,
	})

	sitesHandler := sites.New(sites.NewParams{
		Responder:   responder,
		SiteService: siteService,
	})

	usersHandler := users.New(users.NewParams{
		UserService: userService,
		Responder:   responder,
	})

	mux := http.NewServeMux()

	// middleware
	limiterStore, err := limiterredis.NewStore(redis)
	if err != nil {
		cmd.LogPanic(err, "failed to init limiter store")
	}

	sensitiveRateLimit := alice.New(middleware.SensitiveRateLimit(responder, limiterStore))
	permissionBasicAuthenticated := alice.New(middleware.PermissionBasicAuthenticated(responder))
	permissionUserAccessTokenAuthenticated := alice.New(middleware.PermissionUserAccessTokenAuthenticated(responder))
	permissionOwner := alice.New(middleware.PermissionOrganizationOwner(responder))

	// handlers: authentication
	mux.Handle("GET /authentication/organization", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.ReadOrganization))
	mux.Handle("GET /authentication/user", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.ReadUser))
	mux.Handle("POST /authentication/user-access-tokens", sensitiveRateLimit.Extend(permissionBasicAuthenticated).ThenFunc(authenticationHandler.CreateUserAccessToken))
	mux.Handle("DELETE /authentication/user-access-tokens", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.DeleteUserAccessToken))
	mux.Handle("PATCH /authentication/user", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.UpdateUser))
	mux.Handle("PATCH /authentication/organization", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(authenticationHandler.UpdateOrganization))
	mux.Handle("POST /authentication/change-user-password", permissionBasicAuthenticated.ThenFunc(authenticationHandler.ChangeUserPassword))
	mux.HandleFunc("POST /authentication/send-user-password-recovery-email", authenticationHandler.SendUserPasswordRecoveryEmail)
	mux.HandleFunc("POST /authentication/reset-user-password", authenticationHandler.ResetUserPassword)

	// handlers: bootstrap
	mux.HandleFunc("GET /bootstrap", bootstrapHandler.Check)
	mux.HandleFunc("POST /bootstrap", bootstrapHandler.Run)

	// handlers: docs
	mux.Handle("/docs", http.RedirectHandler(fmt.Sprintf("%s/docs/", envService.RestApiBasePath()), http.StatusFound))
	mux.Handle("/docs/", httpswagger.Handler(httpswagger.DeepLinking(true), httpswagger.Layout(httpswagger.BaseLayout)))

	// handlers: root
	mux.HandleFunc("/{$}", rootHandler.Index())

	// handlers: sites
	mux.Handle("DELETE /sites/{siteID}", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(sitesHandler.Delete))
	mux.Handle("POST /sites", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.Create))
	mux.Handle("GET /sites", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.List))
	mux.Handle("GET /sites/{siteID}", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.Read))
	mux.Handle("PATCH /sites/{siteID}", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(sitesHandler.Update))

	// handlers: users
	mux.Handle("DELETE /users/{userID}", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(usersHandler.Delete))
	mux.Handle("GET /users/{userID}", permissionUserAccessTokenAuthenticated.ThenFunc(usersHandler.Read))
	mux.Handle("GET /users", permissionUserAccessTokenAuthenticated.ThenFunc(usersHandler.List))
	mux.Handle("PATCH /users/{userID}", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(usersHandler.Update))
	mux.Handle("POST /users", permissionUserAccessTokenAuthenticated.Append(permissionOwner.Then).ThenFunc(usersHandler.Invite))

	httpServer := http.Server{
		Handler: alice.New(
			middleware.BasePathHandler(envService),
			middleware.AuthenticationHandler(authenticationService, responder),
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
