package main

import (
	"github.com/stripe/stripe-go/v74"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/restapi"
	"github.com/th0th/poeticmetric/backend/pkg/sentry"
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
