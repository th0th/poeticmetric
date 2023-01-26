package sentry

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
)

func InitIfEnabled() error {
	sentryDsn := env.Get(env.SentryDsn)
	sentryEnvironment := env.Get(env.SentryEnvironment)

	if sentryDsn != "" && sentryEnvironment != "" {
		return sentry.Init(sentry.ClientOptions{
			Dsn:              sentryDsn,
			Debug:            env.GetDebug(),
			AttachStacktrace: true,
			Environment:      sentryEnvironment,
		})
	}

	return nil
}
