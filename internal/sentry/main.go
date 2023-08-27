package sentry

import (
	"github.com/getsentry/sentry-go"
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/internal/env"
)

func InitIfEnabled() error {
	if env.Get().SentryDsn != "" && env.Get().SentryEnvironment != "" {
		err := sentry.Init(sentry.ClientOptions{
			Dsn:              env.Get().SentryDsn,
			Debug:            env.Get().Debug,
			AttachStacktrace: true,
			Environment:      env.Get().SentryEnvironment,
		})
		if err != nil {
			return errors.Wrap(err, 0)
		}
	}

	return nil
}
