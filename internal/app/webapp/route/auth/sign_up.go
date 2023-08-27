package auth

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/app/webapp/usersessiontoken"
	"github.com/th0th/poeticmetric/internal/service/auth"
)

func signUp(c *fiber.Ctx) error {
	ctx := cm.Get(c)

	payload := fiber.Map{
		"Description": "Join the PoeticMetric community today. Sign up for a free account and access powerful, privacy-first web analytics tools for insightful data-driven decisions.",
		"Title":       "Sign up",
	}

	if c.Method() == fiber.MethodPost {
		data := auth.SignUpData{}

		err := c.BodyParser(&data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		_, _, userSessionToken, err := auth.SignUp(ctx, &data)
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

	return c.Render("auth/sign_up", payload)
}
