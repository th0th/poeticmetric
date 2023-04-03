package site

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
	"github.com/th0th/poeticmetric/backend/pkg/validator"
)

func update(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	id, err := helpers.IdParam(c, "id")
	if err != nil {
		return fiber.ErrNotFound
	}

	if !validator.OrganizationSiteId(dp, auth.Organization.Id, id) {
		return fiber.ErrNotFound
	}

	payload := &site.UpdatePayload{}

	err = c.BodyParser(payload)
	if err != nil {
		return err
	}

	s, err := site.Update(dp, id, payload)
	if err != nil {
		return err
	}

	return c.JSON(s)
}
