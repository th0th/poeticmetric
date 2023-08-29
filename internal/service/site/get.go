package site

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func Get(ctx context.Context, id uint) (*model.Site, error) {
	site := model.Site{
		Id: id,
	}

	err := ic.Postgres(ctx).Where(site, "Id").First(&site).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &site, nil
}
