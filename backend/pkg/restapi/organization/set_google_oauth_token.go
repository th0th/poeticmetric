package organization

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
)

func setGoogleOauthToken(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &organization.SetGoogleOauthTokenPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	err = organization.SetGoogleOauthToken(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusOK).JSON(helpers.Detail("OK."))
}
