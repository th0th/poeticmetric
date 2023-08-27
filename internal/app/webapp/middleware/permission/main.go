package permission

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	"github.com/th0th/poeticmetric/internal/app/webapp/toast"
	"github.com/th0th/poeticmetric/internal/pointer"
)

type config struct {
	AuthKind            *am.AuthKind
	IsAuthenticated     *bool
	IsEmailVerified     *bool
	IsOrganizationOwner *bool
}

func New(cfg *config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := am.Get(c)

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
				routeUrl, err := c.GetRouteURL("marketing.home", nil)
				if err != nil {
					return errors.Wrap(err, 0)
				}

				toast.Add(c, &toast.Input{
					Body:    "You need to verify your e-mail address first. Please check your e-mail inbox.",
					Variant: toast.VariantDanger,
				})

				return c.Redirect(routeUrl)
			}
		}

		// IsOwner
		if cfg.IsOrganizationOwner != nil {
			if auth.User == nil || auth.User.IsOrganizationOwner != *cfg.IsOrganizationOwner {
				routeUrl, err := c.GetRouteURL("marketing.home", nil)
				if err != nil {
					return errors.Wrap(err, 0)
				}

				return c.Redirect(routeUrl)
			}
		}

		return c.Next()
	}
}

func AccessTokenAuthenticated(c *fiber.Ctx) error {
	return New(&config{
		IsAuthenticated: pointer.Get(true),
		AuthKind:        pointer.Get(am.KindUserSessionToken),
	})(c)
}

func Authenticated(c *fiber.Ctx) error {
	return New(&config{
		IsAuthenticated: pointer.Get(true),
	})(c)
}

func Owner(c *fiber.Ctx) error {
	return New(&config{
		IsOrganizationOwner: pointer.Get(true),
	})(c)
}

func Unauthenticated(c *fiber.Ctx) error {
	return New(&config{
		IsAuthenticated: pointer.Get(false),
	})(c)
}
