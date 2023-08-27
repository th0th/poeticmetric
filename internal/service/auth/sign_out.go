package auth

import (
	"context"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	context2 "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func SignOut(ctx context.Context, userSessionTokenId uint) error {
	userSessionToken := model.UserSessionToken{Id: userSessionTokenId}

	q := context2.Pg(ctx).Delete(userSessionToken)

	if q.Error != nil {
		return errors.Wrap(q.Error, 0)
	}

	if q.RowsAffected == 0 {
		return errors.Wrap(gorm.ErrRecordNotFound, 0)
	}

	return nil
}
