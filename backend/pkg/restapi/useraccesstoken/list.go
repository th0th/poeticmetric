package useraccesstoken

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/useraccesstoken"
)

func list(c *fiber.Ctx) error {
	auth := authentication.Get(c)

	userAccessTokens, err := useraccesstoken.ListByUserId(dm.Get(c), auth.User.Id)
	if err != nil {
		return err
	}

	return c.JSON(userAccessTokens)
}
