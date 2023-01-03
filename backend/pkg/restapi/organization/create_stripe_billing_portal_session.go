package organization

import (
	"errors"
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/organization"
)

func createStripeBillingPortalSession(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	stripeBillingPortalSession, err := organization.CreateStripeBillingPortalSession(dp, auth.Organization.Id)
	if err != nil {
		if errors.Is(err, organization.ErrNotStripeCustomer) {
			return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("You need to use checkout."))
		}

		return err
	}

	return c.Status(fiber.StatusCreated).JSON(map[string]string{
		"url": stripeBillingPortalSession.URL,
	})
}
