package section

import "github.com/gofiber/fiber/v2"

type Section = string

const (
	Marketing Section = "marketing"
)

func New(section Section) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("Section", section)

		return c.Next()
	}
}
