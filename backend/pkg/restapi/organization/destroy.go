package organization

import (
	"github.com/gofiber/fiber/v2"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
)

func destroy(c *fiber.Ctx) error {
	auth := am.Get(c)
	dp := dm.Get(c)

	payload := &organization.DeletionPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	err = organization.Delete(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
