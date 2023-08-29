package site

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/env"
	"github.com/th0th/poeticmetric/internal/service/organization"
)

func googleSearchConsoleSiteSelect(c *fiber.Ctx) error {
	ctx := cm.Get(c)
	auth := am.Get(c)

	payload := fiber.Map{
		"GoogleClientId": env.Get().GoogleClientId,
	}

	queries := struct {
		GoogleOauthAuthorizationCode string `query:"code"`
	}{}

	err := c.QueryParser(&queries)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = organization.SetGoogleOauthRefreshToken(ctx, auth.User.OrganizationId, queries.GoogleOauthAuthorizationCode)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	googleSearchConsoleSites, err := organization.ListGoogleSearchConsoleSites(ctx, auth.User.OrganizationId)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	payload["GoogleSearchConsoleSites"] = googleSearchConsoleSites

	return c.Render("site/partial/google_search_console_site_select", payload, "")
}
