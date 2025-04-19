package authentication

import (
	"context"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ReadPlan(ctx context.Context, planID uint) (*poeticmetric.AuthenticationPlan, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	plan := poeticmetric.AuthenticationPlan{}
	err := postgres.First(&plan, poeticmetric.Plan{ID: planID}).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &plan, nil
}
