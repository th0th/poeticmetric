package site

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/service/organization"
	ss "github.com/th0th/poeticmetric/internal/service/site"
	vh "github.com/th0th/poeticmetric/internal/validatinghelper"
)

func add(c *fiber.Ctx) error {
	ctx := cm.Get(c)
	auth := am.Get(c)

	payload := fiber.Map{
		"GoogleClientId": env.Get().GoogleClientId,
		"Title":          "Add site",
	}

	if auth.User.Organization.GoogleOauthRefreshToken != nil {
		googleSearchConsoleSites, err := organization.ListGoogleSearchConsoleSites(ctx, auth.User.OrganizationId)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		payload["GoogleSearchConsoleSites"] = googleSearchConsoleSites
	}

	if c.Method() == fiber.MethodPost {
		data := ss.CreateData{}

		err := c.BodyParser(&data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		payload["Data"] = data

		_, err = ss.Create(ctx, auth.User.OrganizationId, &data)
		if err != nil {
			validationErrs := v.Errors{}
			if errors.As(err, &validationErrs) {
				payload["Errors"] = vh.GetErrorsMap(validationErrs)
			} else {
				return errors.Wrap(err, 0)
			}
		} else {
			routeUrl, err2 := c.GetRouteURL("site.list", nil)
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}

			return c.Redirect(routeUrl)
		}
	}

	return c.Render("site/form", payload)
}
