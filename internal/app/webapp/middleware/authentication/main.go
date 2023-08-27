package authentication

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/model"
)

type AuthKind = string

type Auth struct {
	Kind             *AuthKind
	User             *model.User
	UserSessionToken *model.UserSessionToken
}

const (
	KindUserSessionToken AuthKind = "USER_SESSION_TOKEN"
)

const localsKey = "Auth"

func Get(c *fiber.Ctx) *Auth {
	return c.Locals(localsKey).(*Auth)
}

func New(c *fiber.Ctx) error {
	c.Locals(localsKey, &Auth{})

	return c.Next()
}

func Set(c *fiber.Ctx, auth *Auth) {
	c.Locals(localsKey, auth)
}
