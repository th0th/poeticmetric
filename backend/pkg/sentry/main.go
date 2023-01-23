package sentry

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
)

func InitIfEnabled() error {
	if env.Get(env.SentryDsn) != "" {
		return sentry.Init(sentry.ClientOptions{
			Dsn:              env.Get(env.SentryDsn),
			Debug:            env.GetDebug(),
			AttachStacktrace: true,
			Environment:      env.GetStage(),
		})
	}

	return nil
}
