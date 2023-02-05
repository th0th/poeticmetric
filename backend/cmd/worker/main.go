package main

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/sentry"
	"github.com/th0th/poeticmetric/backend/pkg/worker"
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

	dp := depot.New()

	workerQueues := env.GetWorkerQueues()
	if len(workerQueues) == 1 && workerQueues[0] == "" {
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
