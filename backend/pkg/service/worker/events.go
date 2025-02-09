package worker

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) createEvent(ctx context.Context, deliveryBody []byte) error {
	params, err := poeticmetric.GetWorkParams[poeticmetric.CreateEventParams](deliveryBody)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = s.eventService.Create(ctx, &params)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
