package auth

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/service/auth"
)

func signOut(c *fiber.Ctx) error {
	ctx := cm.Get(c)
	a := am.Get(c)

	err := auth.SignOut(ctx, a.UserSessionToken.Id)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	routeUrl, err := c.GetRouteURL("marketing.home", nil)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return c.Redirect(routeUrl)
}
