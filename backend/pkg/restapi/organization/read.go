package organization

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/organization"
)

func read(c *fiber.Ctx) error {
	dp := c.Locals("depot").(*depot.Depot)
	auth := c.Locals("auth").(*authentication.Auth)

	o, err := organization.Read(dp, auth.Organization.Id)
	if err != nil {
		return err
	}

	return c.JSON(o)
}
