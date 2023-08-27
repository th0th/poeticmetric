package toast

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/app/webapp/toast"
)

func New(c *fiber.Ctx) error {
	toast.SetInLocals(c, toast.Get(c))

	return c.Next()
}
