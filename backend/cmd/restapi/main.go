package main

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi"
	"github.com/poeticmetric/poeticmetric/backend/pkg/sentry"
	"github.com/stripe/stripe-go/v74"
)

func main() {
	err := env.Check()
	if err != nil {
		panic(err)
	}

	err = sentry.InitIfEnabled()
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
