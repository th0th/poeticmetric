package worker

import (
	"context"

	"github.com/go-errors/errors"
)

func (s *service) deleteUnverifiedOrganizations(ctx context.Context, _ []byte) error {
	err := s.organizationService.DeleteUnverifiedOrganizations(ctx)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
