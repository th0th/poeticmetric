package workpublisher

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) DeleteUnverifiedOrganizations(ctx context.Context) error {
	err := s.publish(ctx, poeticmetric.QueueDefaultName, poeticmetric.WorkDeleteUnverifiedOrganizations, nil, nil)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
