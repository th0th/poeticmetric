package workpublisher

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) CreateEvent(ctx context.Context, params *poeticmetric.CreateEventParams) error {
	err := s.publish(poeticmetric.QueueDefaultName, poeticmetric.WorkCreateEvent, params, nil)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
