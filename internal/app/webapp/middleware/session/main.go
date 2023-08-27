package session

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

const localsKey = "Session"

func Get(c *fiber.Ctx) *session.Session {
	store := c.Locals(localsKey).(*session.Store)

	s, err := store.Get(c)
	if err != nil {
		panic(errors.Wrap(err, 0))
	}

	return s
}

func New(store *session.Store) fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals(localsKey, store)

		return c.Next()
	}
}
