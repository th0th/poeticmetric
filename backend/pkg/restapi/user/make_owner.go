package user

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	user2 "github.com/th0th/poeticmetric/backend/pkg/service/user"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

func makeOwner(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &user2.MakeOwnerPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	if auth.User.Id == *payload.Id {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("You are already organization owner."))
	}

	if !validator.OrganizationUserId(dp, auth.Organization.Id, *payload.Id) {
		return fiber.ErrNotFound
	}

	user, err := user2.MakeOwner(dp, payload)
	if err != nil {
		return err
	}

	return c.JSON(user)
}
