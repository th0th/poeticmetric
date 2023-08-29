package validator

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func OrganizationSiteId(ctx context.Context, organizationId uint, siteId uint) bool {
	var count int64

	siteFilter := model.Site{Id: siteId, OrganizationId: organizationId}

	err := ic.Postgres(ctx).
		Model(&model.Site{}).
		Where(siteFilter, "Id", "OrganizationId").
		Count(&count).
		Error
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	return count == 1
}
