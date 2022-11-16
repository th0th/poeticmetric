package depotimport

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
)

func Get(c *fiber.Ctx) *depot.Depot {
	return c.Locals("depot").(*depot.Depot)
}

func New(dp *depot.Depot) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("depot", dp)

		return c.Next()
	}
}
