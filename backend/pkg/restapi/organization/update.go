package organization

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
)

func update(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &organization.UpdatePayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	s, err := organization.Update(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.JSON(s)
}
