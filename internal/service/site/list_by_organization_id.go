package site

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func ListByOrganizationId(ctx context.Context, organizationId uint) ([]*model.Site, error) {
	sites := []*model.Site{}

	err := ic.Postgres(ctx).Model(&model.Site{}).Find(&sites).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return sites, nil
}
