package fibercontext

import "github.com/gofiber/fiber/v2"

const localsKey = "C"

func New(c *fiber.Ctx) error {
	c.Locals(localsKey, c)

	return c.Next()
}
