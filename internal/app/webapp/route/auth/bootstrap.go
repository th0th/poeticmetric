package auth

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/app/webapp/toast"
	"github.com/th0th/poeticmetric/internal/app/webapp/usersessiontoken"
	context2 "github.com/th0th/poeticmetric/internal/context"
	"github.com/th0th/poeticmetric/internal/model"
	"github.com/th0th/poeticmetric/internal/service/auth"
)

func bootstrap(c *fiber.Ctx) error {
	ctx := cm.Get(c)

	payload := fiber.Map{}

	var planCount int64

	err := context2.Pg(ctx).Model(&model.Plan{}).Limit(1).Count(&planCount).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	if planCount != 0 {
		toast.Add(c, &toast.Input{
			Body:    "Database is not empty.",
			Variant: toast.VariantDanger,
		})

		routeUrl, err2 := c.GetRouteURL("marketing.home", nil)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return c.Redirect(routeUrl)
	}

	if c.Method() == fiber.MethodPost {
		data := auth.BootstrapData{}

		err = c.BodyParser(&data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		payload["Data"] = data

		userSessionToken, err2 := auth.Bootstrap(ctx, &data)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		usersessiontoken.Set(c, userSessionToken.Token)

		toast.Add(c, &toast.Input{
			Body:    "Installation is complete!",
			Variant: toast.VariantSuccess,
		})

		routeUrl, err2 := c.GetRouteURL("marketing.home", nil)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return c.Redirect(routeUrl)
	}

	return c.Render("auth/bootstrap", payload)
}
