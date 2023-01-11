package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userself"
)

func passwordRecovery(c *fiber.Ctx) error {
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
