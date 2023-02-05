package root

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/frontend"
)

func index(c *fiber.Ctx) error {
	return c.Redirect(frontend.GenerateUrl("/"))
}
