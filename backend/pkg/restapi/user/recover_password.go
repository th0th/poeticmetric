package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func recoverPassword(c *fiber.Ctx) error {
	dp := dm.Get(c)

	payload := &userself.RecoverPasswordPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	err = userself.RecoverPassword(dp, payload)
	if err != nil {
		return err
	}

	return c.JSON(helpers.Detail("OK."))
}
