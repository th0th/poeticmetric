package site

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	am2 "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/site"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

func destroy(c *fiber.Ctx) error {
	dp := dm.Get(c)
	am := am2.Get(c)

	id, err := helpers.IdParam(c, "id")
	if err != nil {
		return err
	}

	if !validator.OrganizationSiteId(dp, am.Organization.Id, id) {
		return fiber.ErrNotFound
	}

	return site.Delete(dp, id)
}
