package validator

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func SiteUniqueDomain(ctx context.Context, v string, siteId *uint) bool {
	var count int64

	filter := model.Site{Domain: v}

	q := ic.Postgres(ctx).Model(&model.Site{}).Where(filter, "Domain").Limit(1)

	if siteId != nil {
		q.Where("site_id != ?", *siteId)
	}

	err := q.Count(&count).Error
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	return count == 0
}
