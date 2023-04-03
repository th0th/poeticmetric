package permission

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
)

func OrganizationSubscription(c *fiber.Ctx) error {
	auth := c.Locals("auth").(*authentication.Auth)

	if auth.Organization.Plan == nil {
		return c.
			Status(fiber.StatusForbidden).
			JSON(helpers.Detail("You need to subscribe to continue to use PoeticMetric"))
	}

	return c.Next()
}
