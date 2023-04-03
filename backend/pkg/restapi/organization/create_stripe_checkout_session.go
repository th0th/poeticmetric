package organization

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
)

func createStripeCheckoutSession(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	payload := &organization.CreateStripeCheckoutSessionPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	stripeCheckoutSession, err := organization.CreateStripeCheckoutSession(dp, auth.Organization.Id, payload)
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(map[string]string{
		"stripeCheckoutSessionId": stripeCheckoutSession.ID,
	})
}
