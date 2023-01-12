package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/user"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

func destroy(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	id, err := helpers.IdParam(c, "id")
	if err != nil {
		return fiber.ErrNotFound
	}

	if !validator.OrganizationUserId(dp, auth.Organization.Id, id) {
		return fiber.ErrNotFound
	}

	if auth.User.Id == id {
		return c.
			Status(fiber.StatusBadRequest).
			JSON(helpers.Detail("You can't delete your own account."))
	}

	err = user.Delete(dp, id)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
