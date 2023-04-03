package useraccesstoken

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/useraccesstoken"
)

func list(c *fiber.Ctx) error {
	auth := authentication.Get(c)

	userAccessTokens, err := useraccesstoken.ListByUserId(dm.Get(c), auth.User.Id)
	if err != nil {
		return err
	}

	return c.JSON(userAccessTokens)
}
