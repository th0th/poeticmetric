package site

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/service/site"
)

func list(c *fiber.Ctx) error {
	ctx := cm.Get(c)
	auth := am.Get(c)

	payload := fiber.Map{
		"Title": "Sites",
	}

	sites, err := site.ListByOrganizationId(ctx, auth.User.OrganizationId)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	payload["Sites"] = sites

	return c.Render("site/list", payload)
}
