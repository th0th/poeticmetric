package validator

import (
	"context"

	"github.com/go-errors/errors"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func UserEmail(ctx context.Context, v string) bool {
	var count int64

	err := ic.Postgres(ctx).
		Model(&model.User{}).
		Where("email = ?", v).
		Limit(1).
		Count(&count).
		Error
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	return count == 1
}