package permission

import (
	"github.com/gofiber/fiber/v2"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
)

func OrganizationNonStripeCustomer(c *fiber.Ctx) error {
	auth := am.Get(c)

	if auth.Organization.StripeCustomerId != nil {
		return fiber.ErrForbidden
	}

	return c.Next()
}
