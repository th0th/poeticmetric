package main

import (
	"github.com/getsentry/sentry-go"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/worker"
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

	dp := depot.New()

	workerQueues := env.GetWorkerQueues()
	if len(workerQueues) == 1 && workerQueues[0] == "_all_" {
		workerQueues = []string{}

		for _, queue := range worker.Queues {
			workerQueues = append(workerQueues, string(queue.Name))
		}
	}

	err = worker.Run(dp, workerQueues)
	if err != nil {
		panic(err)
	}
}
