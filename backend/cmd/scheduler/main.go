package main

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/signal"
	"github.com/poeticmetric/poeticmetric/backend/pkg/worker"
	"github.com/robfig/cron/v3"
	"log"
)

func handleCallError(err error) {
	log.Printf("An error has occurred: %v", err)
	sentry.CaptureException(err)
}

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

	dp := depot.New()

	log.Println("⏱️Starting scheduler...")

	cr := cron.New()

	if env.GetIsHosted() {
		_, err = cr.AddFunc("0 12 * * *", func() {
			log.Println("Notifying about trial midways...")

			err2 := worker.NotifyAboutTrialMidways(dp)
			if err2 != nil {
				handleCallError(err2)
			}
		})

		_, err = cr.AddFunc("0 12 * * *", func() {
			log.Println("Notifying about ending trials...")

			err2 := worker.NotifyAboutEndingTrials(dp)
			if err2 != nil {
				handleCallError(err2)
			}
		})

		_, err = cr.AddFunc("0 12 * * *", func() {
			log.Println("Ending trials...")

			err2 := worker.EndTrials(dp)
			if err2 != nil {
				handleCallError(err2)
			}
		})
	}

	go func() {
		sentry.Recover()

		cr.Run()
	}()

	signal.ExitWithSignal()
}
