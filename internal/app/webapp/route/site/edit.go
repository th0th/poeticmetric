package site

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/service/organization"
	ss "github.com/th0th/poeticmetric/internal/service/site"
	vh "github.com/th0th/poeticmetric/internal/validatinghelper"
)

func edit(c *fiber.Ctx) error {
	ctx := cm.Get(c)
	auth := am.Get(c)

	payload := fiber.Map{
		"GoogleClientId": env.Get().GoogleClientId,
		"Title":          "Edit site",
	}

	params := struct {
		SiteId uint `params:"site_id"`
	}{}

	err := c.ParamsParser(&params)
	if err != nil {
		return errors.Wrap(fiber.ErrNotFound, 0)
	}

	site, err := ss.Get(ctx, params.SiteId)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.Wrap(fiber.ErrNotFound, 0)
		}

		return errors.Wrap(err, 0)
	}

	payload["Domain"] = site.Domain
	payload["Data"] = ss.UpdateData{
		IsPublic:            site.IsPublic,
		Name:                site.Name,
		SafeQueryParameters: site.SafeQueryParameters,
	}

	if auth.User.Organization.GoogleOauthRefreshToken != nil {
		googleSearchConsoleSites, err2 := organization.ListGoogleSearchConsoleSites(ctx, auth.User.OrganizationId)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		payload["GoogleSearchConsoleSites"] = googleSearchConsoleSites
	}

	if c.Method() == fiber.MethodPost {
		data := ss.UpdateData{}

		err = c.BodyParser(&data)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		_, err = ss.Update(ctx, params.SiteId, &data)
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
