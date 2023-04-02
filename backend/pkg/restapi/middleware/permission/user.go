package permission

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
)

type userPermissionMiddlewareConfig struct {
	AuthKind            *authentication.AuthKind
	IsAuthenticated     *bool
	IsEmailVerified     *bool
	IsOrganizationOwner *bool
}

func User(cfg *userPermissionMiddlewareConfig) fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := c.Locals("auth").(*authentication.Auth)

		// IsAuthenticated
		if cfg.IsAuthenticated != nil {
			if *cfg.IsAuthenticated && auth.User == nil {
				return fiber.ErrUnauthorized
			}

			if !*cfg.IsAuthenticated && auth.User != nil {
				return fiber.ErrForbidden
			}
		}

		// AuthKind
		if cfg.AuthKind != nil {
			if *auth.Kind != *cfg.AuthKind {
				return fiber.ErrForbidden
			}
		}

		// IsEmailVerified
		if cfg.IsEmailVerified != nil {
			if auth.User == nil || auth.User.IsEmailVerified != *cfg.IsEmailVerified {
				return c.
					Status(fiber.StatusForbidden).
					JSON(helpers.Detail("You need to verify your e-mail address."))
			}
		}

		// IsOwner
		if cfg.IsOrganizationOwner != nil {
			if auth.User == nil || auth.User.IsOrganizationOwner != *cfg.IsOrganizationOwner {
				return c.
					Status(fiber.StatusForbidden).
					JSON(helpers.Detail("You need to be the organization owner."))
			}
		}

		return c.Next()
	}
}

func UserAccessTokenAuthenticated(c *fiber.Ctx) error {
	return User(&userPermissionMiddlewareConfig{
		IsAuthenticated: pointer.Get(true),
		AuthKind:        pointer.Get(authentication.AuthKindRestApiUserAccessToken),
	})(c)
}

func UserAuthenticated(c *fiber.Ctx) error {
	return User(&userPermissionMiddlewareConfig{
		IsAuthenticated: pointer.Get(true),
	})(c)
}

func UserBasicAuthenticated(c *fiber.Ctx) error {
	return User(&userPermissionMiddlewareConfig{
		IsAuthenticated: pointer.Get(true),
		AuthKind:        pointer.Get(authentication.AuthKindRestApiUserBasic),
	})(c)
}

func UserOwner(c *fiber.Ctx) error {
	return User(&userPermissionMiddlewareConfig{
		IsOrganizationOwner: pointer.Get(true),
	})(c)
}

func UserUnauthenticated(c *fiber.Ctx) error {
	return User(&userPermissionMiddlewareConfig{
		IsAuthenticated: pointer.Get(false),
	})(c)
}
