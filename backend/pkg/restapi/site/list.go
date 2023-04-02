package site

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
)

func list(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	sites, err := site.List(dp, auth.Organization.Id)
	if err != nil {
		return err
	}

	return c.JSON(sites)
}
