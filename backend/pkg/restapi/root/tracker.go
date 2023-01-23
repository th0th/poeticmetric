package root

import (
	"github.com/gofiber/fiber/v2"
	tracker2 "github.com/poeticmetric/poeticmetric/backend/pkg/tracker"
)

func tracker(c *fiber.Ctx) error {
	c.Set("content-type", "application/javascript")

	return c.SendString(tracker2.Get())
}
