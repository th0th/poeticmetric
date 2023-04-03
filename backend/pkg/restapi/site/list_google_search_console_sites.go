package site

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
)

func listGoogleSearchConsoleSites(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	if auth.Organization.GoogleOauthRefreshToken == nil {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("Please authenticate with Google first."))
	}

	sites, err := site.ListGoogleSearchConsoleSites(dp, auth.Organization.Id)
	if err != nil {
		if errors.Is(err, site.ErrInvalidGoogleOauthToken) {
			return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("Please re-authenticate with Google."))
		}

		return err
	}

	return c.JSON(sites)
}
