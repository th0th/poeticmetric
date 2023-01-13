package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	user2 "github.com/poeticmetric/poeticmetric/backend/pkg/service/user"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

func update(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	id, err := helpers.IdParam(c, "id")
	if err != nil {
		return fiber.ErrNotFound
	}

	payload := &user2.UpdatePayload{}

	err = c.BodyParser(payload)
	if err != nil {
		return err
	}

	if !validator.OrganizationUserId(dp, auth.Organization.Id, id) {
		return fiber.ErrNotFound
	}

	user, err := user2.Update(dp, id, payload)
	if err != nil {
		return err
	}

	return c.JSON(user)
}
