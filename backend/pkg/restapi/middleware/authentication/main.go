package authentication

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

type AuthKind string

type Auth struct {
	Kind            *AuthKind
	Organization    *model.Organization
	User            *model.User
	UserAccessToken *model.UserAccessToken
}

const (
	AuthKindRestApiUserBasic       AuthKind = "REST_API_USER_BASIC"
	AuthKindRestApiUserAccessToken AuthKind = "REST_API_USER_ACCESS_TOKEN"
)

func Get(c *fiber.Ctx) *Auth {
	return c.Locals("auth").(*Auth)
}

func New() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("auth", &Auth{})

		return c.Next()
	}
}
