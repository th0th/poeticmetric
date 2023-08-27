package context

import (
	"context"

	"github.com/gofiber/fiber/v2"
)

const localsKey = "context"

func Get(c *fiber.Ctx) context.Context {
	return c.Locals(localsKey).(context.Context)
}

func New(ctx context.Context) fiber.Handler {
	return func(c *fiber.Ctx) error {
		Set(c, ctx)

		return c.Next()
	}
}

func Set(c *fiber.Ctx, ctx context.Context) {
	c.Locals(localsKey, ctx)
}
