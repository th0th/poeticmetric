package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-errors/errors"
	"github.com/gorilla/schema"
	"github.com/justinas/alice"
	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/hlog"
	httpswagger "github.com/swaggo/http-swagger/v2"
	govalkey "github.com/valkey-io/valkey-go"
	gormclickhouse "gorm.io/driver/clickhouse"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/lib/log"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/docs"
	authenticationhandler "github.com/th0th/poeticmetric/backend/pkg/restapi/handler/authentication"
	bootstraphandler "github.com/th0th/poeticmetric/backend/pkg/restapi/handler/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/events"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/root"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/sitereports"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/sites"
	trackinghandler "github.com/th0th/poeticmetric/backend/pkg/restapi/handler/tracking"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/handler/users"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
	restapiresponder "github.com/th0th/poeticmetric/backend/pkg/restapi/responder"
	"github.com/th0th/poeticmetric/backend/pkg/service/authentication"
	"github.com/th0th/poeticmetric/backend/pkg/service/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/service/email"
	"github.com/th0th/poeticmetric/backend/pkg/service/env"
	"github.com/th0th/poeticmetric/backend/pkg/service/event"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
	"github.com/th0th/poeticmetric/backend/pkg/service/tracking"
	"github.com/th0th/poeticmetric/backend/pkg/service/user"
	"github.com/th0th/poeticmetric/backend/pkg/service/validation"
	"github.com/th0th/poeticmetric/backend/pkg/service/workpublisher"
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
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to init env service")
	}

	docs.SwaggerInfo.BasePath = envService.RestApiBasePath()

	postgres, err := gorm.Open(gormpostgres.Open(envService.PostgresDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to init postgres")
	}

	clickHouse, err := gorm.Open(gormclickhouse.Open(envService.ClickHouseDsn()), envService.GormConfig())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to init clickhouse")
	}

	rabbitMQ, err := amqp.Dial(envService.RabbitMqURL())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("rabbitmq initialization failed")
	}
	defer rabbitMQ.Close()

	valkey, err := govalkey.NewClient(envService.ValkeyClientOption())
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to init valkey client")
	}

	decoder := schema.NewDecoder()
	decoder.IgnoreUnknownKeys(true)

	validationService := validation.New(validation.NewParams{
		EnvService: envService,
		Postgres:   postgres,
	})

	emailService, err := email.New(email.NewParams{
		EnvService: envService,
	})
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to init email service")
	}

	authenticationService := authentication.New(authentication.NewParams{
		EmailService:      emailService,
		Postgres:          postgres,
		ValidationService: validationService,
	})

	bootstrapService := bootstrap.New(bootstrap.NewParams{
		Clickhouse: clickHouse,
		EnvService: envService,
		Postgres:   postgres,
	})

	eventService := event.New(event.NewParams{
		ClickHouse: clickHouse,
		Postgres:   postgres,
		Valkey:     valkey,
	})

	siteService := site.New(site.NewParams{
		ClickHouse:        clickHouse,
		Postgres:          postgres,
		ValidationService: validationService,
	})

	trackingService := tracking.New(tracking.NewParams{
		EnvService: envService,
	})

	userService := user.New(user.NewParams{
		EmailService:      emailService,
		Postgres:          postgres,
		ValidationService: validationService,
	})

	workPublisher := workpublisher.New(workpublisher.NewParams{
		RabbitMQ: rabbitMQ,
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

	eventsHandler := events.New(events.NewParams{
		EventService:      eventService,
		Responder:         responder,
		ValidationService: validationService,
		WorkPublisher:     workPublisher,
	})

	rootHandler := root.New(root.NewParams{
		EnvService: envService,
	})

	siteReportsHandler := sitereports.New(sitereports.NewParams{
		Responder:   responder,
		SiteService: siteService,
	})

	sitesHandler := sites.New(sites.NewParams{
		Responder:   responder,
		SiteService: siteService,
	})

	trackingHandler := trackinghandler.New(trackinghandler.NewParams{
		Responder:       responder,
		TrackingService: trackingService,
	})

	usersHandler := users.New(users.NewParams{
		UserService: userService,
		Responder:   responder,
	})

	mux := http.NewServeMux()

	// middleware
	sensitiveRateLimit := alice.New(middleware.SensitiveRateLimit(responder, valkey))
	permissionBasicAuthenticated := alice.New(middleware.PermissionBasicAuthenticated(responder))
	permissionUserAccessTokenAuthenticated := alice.New(middleware.PermissionUserAccessTokenAuthenticated(responder))
	permissionOwner := alice.New(middleware.PermissionOrganizationOwner(responder))
	siteReportFilters := alice.New(middleware.SiteReportFiltersHandler(validationService, decoder, responder))

	// handlers: authentication
	mux.Handle("DELETE /authentication/organization", permissionBasicAuthenticated.Extend(permissionOwner).ThenFunc(authenticationHandler.DeleteOrganization))
	mux.Handle("GET /authentication/organization", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.ReadOrganization))
	mux.Handle("GET /authentication/organization-deletion-options", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(authenticationHandler.GetOrganizationDeletionOptions))
	mux.Handle("GET /authentication/user", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.ReadUser))
	mux.Handle("POST /authentication/user-access-tokens", sensitiveRateLimit.Extend(permissionBasicAuthenticated).ThenFunc(authenticationHandler.CreateUserAccessToken))
	mux.Handle("DELETE /authentication/user-access-tokens", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.DeleteUserAccessToken))
	mux.Handle("PATCH /authentication/user", permissionUserAccessTokenAuthenticated.ThenFunc(authenticationHandler.UpdateUser))
	mux.Handle("PATCH /authentication/organization", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(authenticationHandler.UpdateOrganization))
	mux.Handle("POST /authentication/change-user-password", permissionBasicAuthenticated.ThenFunc(authenticationHandler.ChangeUserPassword))
	mux.HandleFunc("POST /authentication/send-user-password-recovery-email", authenticationHandler.SendUserPasswordRecoveryEmail)
	mux.HandleFunc("POST /authentication/reset-user-password", authenticationHandler.ResetUserPassword)

	// handlers: bootstrap
	mux.HandleFunc("GET /bootstrap", bootstrapHandler.Check)
	mux.HandleFunc("POST /bootstrap", bootstrapHandler.Run)

	// handlers: docs
	mux.Handle("/docs", http.RedirectHandler(fmt.Sprintf("%s/docs/", envService.RESTApiURL("")), http.StatusFound))
	mux.Handle("/docs/", httpswagger.Handler(httpswagger.DeepLinking(true), httpswagger.Layout(httpswagger.BaseLayout)))

	// handlers: events
	mux.HandleFunc("POST /events", eventsHandler.Create)

	// handlers: root
	mux.HandleFunc("/{$}", rootHandler.Index())

	// handlers: sites
	mux.Handle("DELETE /sites/{siteID}", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(sitesHandler.Delete))
	mux.Handle("POST /sites", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.Create))
	mux.Handle("GET /sites", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.List))
	mux.Handle("GET /sites/{siteID}", permissionUserAccessTokenAuthenticated.ThenFunc(sitesHandler.Read))
	mux.Handle("PATCH /sites/{siteID}", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(sitesHandler.Update))

	// handlers: site reports
	mux.Handle("GET /site-reports/browser-name", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteBrowserNameReport))
	mux.Handle("GET /site-reports/browser-version", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteBrowserVersionReport))
	mux.Handle("GET /site-reports/country", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteCountryReport))
	mux.Handle("GET /site-reports/device-type", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteDeviceTypeReport))
	mux.Handle("GET /site-reports/language", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteLanguageReport))
	mux.Handle("GET /site-reports/operating-system-name", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteOperatingSystemNameReport))
	mux.Handle("GET /site-reports/operating-system-version", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteOperatingSystemVersionReport))
	mux.Handle("GET /site-reports/overview", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteOverviewReport))
	mux.Handle("GET /site-reports/page-view", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSitePageViewReport))
	mux.Handle("GET /site-reports/path", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSitePathReport))
	mux.Handle("GET /site-reports/referrer", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteReferrerReport))
	mux.Handle("GET /site-reports/referrer-host", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteReferrerHostReport))
	mux.Handle("GET /site-reports/time-of-week-trends", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteTimeOfWeekTrendsReport))
	mux.Handle("GET /site-reports/utm-campaign", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteUTMCampaignReport))
	mux.Handle("GET /site-reports/utm-source", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteUTMSourceReport))
	mux.Handle("GET /site-reports/visitor", permissionUserAccessTokenAuthenticated.Extend(siteReportFilters).ThenFunc(siteReportsHandler.ReadSiteVisitorReport))

	// handlers: tracker
	mux.HandleFunc("GET /pm.js", trackingHandler.Script)

	// handlers: users
	mux.Handle("DELETE /users/{userID}", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(usersHandler.Delete))
	mux.Handle("GET /users/{userID}", permissionUserAccessTokenAuthenticated.ThenFunc(usersHandler.Read))
	mux.Handle("GET /users", permissionUserAccessTokenAuthenticated.ThenFunc(usersHandler.List))
	mux.Handle("PATCH /users/{userID}", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(usersHandler.Update))
	mux.Handle("POST /users", permissionUserAccessTokenAuthenticated.Extend(permissionOwner).ThenFunc(usersHandler.Invite))

	httpServer := http.Server{
		Handler: alice.New(
			middleware.BasePathHandler(envService),
			middleware.AuthenticationHandler(authenticationService, responder),
			hlog.NewHandler(Logger),
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
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("failed to start http server")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt)
	<-signalChannel
	err = httpServer.Shutdown(ctx)
	if err != nil {
		Logger.Panic().Stack().Err(errors.Wrap(err, 0)).Msg("http server shutdown failed")
	}
}

var Logger = zerolog.New(os.Stdout).With().Timestamp().Logger()
