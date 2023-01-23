package main

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	sentry2 "github.com/poeticmetric/poeticmetric/backend/pkg/sentry"
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

	err = sentry2.InitIfEnabled()
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
