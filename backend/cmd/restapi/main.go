package main

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi"
	"github.com/stripe/stripe-go/v74"
)

func main() {
	err := env.Check()
	if err != nil {
		panic(err)
	}

	// sentry initialization
	err = sentry.Init(sentry.ClientOptions{
		Dsn:              env.Get(env.SentryDsn),
		Debug:            env.Get(env.Stage) == env.StageDevelopment,
		AttachStacktrace: true,
		Environment:      env.Get(env.Stage),
	})
	if err != nil {
		panic(err)
	}

	// stripe
	stripe.Key = env.Get(env.StripeSecretKey)

	dp := depot.New()

	app := restapi.New(dp)

	err = app.Listen("0.0.0.0:80")
	if err != nil {
		panic(err)
	}
}
