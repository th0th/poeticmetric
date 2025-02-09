package env

import (
	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) WorkerConcurrency() int {
	return s.vars.WorkerConcurrency
}

func (s *service) WorkerQueues() []string {
	if len(s.vars.WorkerQueues) == 0 {
		qMap := poeticmetric.Queues(false)
		qs := make([]string, 0, len(qMap))
		for q := range qMap {
			qs = append(qs, string(q))
		}

		return qs
	}

	return s.vars.WorkerQueues
}
