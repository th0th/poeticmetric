package permission

import (
	"reflect"

	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/helpers"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
)

func OrganizationPlanFeatureFlag(flag string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		auth := authentication.Get(c)

		if !reflect.ValueOf(auth.Organization.Plan).FieldByName(flag).Bool() {
			return c.Status(fiber.StatusForbidden).JSON(helpers.Detail("You need to upgrade your subscription."))
		}

		return c.Next()
	}
}
