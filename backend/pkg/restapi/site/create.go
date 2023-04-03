package site

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
)

func create(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &site.CreatePayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	s, err := site.Create(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(s)
}
