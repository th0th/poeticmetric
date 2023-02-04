package user

import (
	"github.com/gofiber/fiber/v2"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func updateSelf(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &userself.UpdatePayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	s, err := userself.Update(dp, auth.User.Id, payload)
	if err != nil {
		return err
	}

	return c.JSON(s)
}
