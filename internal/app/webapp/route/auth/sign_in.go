package auth

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/app/webapp/usersessiontoken"
	"github.com/th0th/poeticmetric/internal/service/auth"
)

func signIn(c *fiber.Ctx) error {
	ctx := cm.Get(c)

	payload := fiber.Map{
		"Title":       "Sign in",
		"Description": "Sign in to your PoeticMetric account and gain access to powerful website analytics features.",
	}

	if c.Method() == fiber.MethodPost {
		data := auth.SignInData{}

		err := c.BodyParser(&data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		userSessionToken, err := auth.SignIn(ctx, &data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		usersessiontoken.Set(c, userSessionToken.Token)

		routeUrl, err := c.GetRouteURL("marketing.home", nil)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return c.Redirect(routeUrl)
	}

	return c.Render("auth/sign_in", payload)
}
