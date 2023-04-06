package root

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/mailbluster"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
)

func createNewsletterSubscription(c *fiber.Ctx) error {
	dp := dm.Get(c)

	payload := &mailbluster.AddLeadPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	err = mailbluster.AddLead(dp, payload)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusCreated)
}
