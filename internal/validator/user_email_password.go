package validator

import (
	"context"

	"github.com/go-errors/errors"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"

	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
)

func UserEmailPassword(ctx context.Context, email string, password string) bool {
	user := model.User{
		Email: email,
	}

	err := ic.Postgres(ctx).
		Select("Password").
		Where(user, "Email").
		First(&user).
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false
		}

		panic(errors.Wrap(err, 0))
	}

	return bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)) == nil
}
