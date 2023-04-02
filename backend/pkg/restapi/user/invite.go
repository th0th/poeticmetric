package user

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	user2 "github.com/th0th/poeticmetric/backend/pkg/service/user"
)

func invite(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &user2.InvitePayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	user, err := user2.Invite(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(user)
}
