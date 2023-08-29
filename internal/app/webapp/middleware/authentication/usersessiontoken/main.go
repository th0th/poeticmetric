package usersessiontoken

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/app/webapp/usersessiontoken"
	ic "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
	"github.com/th0th/poeticmetric/internal/pointer"
)

func New(c *fiber.Ctx) error {
	ctx := cm.Get(c)

	token := usersessiontoken.Get(c)
	if token == "" {
		return c.Next()
	}

	userSessionToken := model.UserSessionToken{
		Token: token,
	}

	err := ic.Postgres(ctx).Where(userSessionToken, "Token").First(&userSessionToken).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			usersessiontoken.Clear(c)

			return c.Next()
		} else {
			return errors.Wrap(err, 0)
		}
	}

	user := model.User{
		Id: userSessionToken.UserId,
	}

	err = ic.Postgres(ctx).Joins("Organization").Where(user, "Id").First(&user).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	am.Set(c, &am.Auth{
		Kind:             pointer.Get(am.KindUserSessionToken),
		User:             &user,
		UserSessionToken: &userSessionToken,
	})

	return c.Next()
}
