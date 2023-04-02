package root

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/bootstrap"
)

func bootstrapStatus(c *fiber.Ctx) error {
	dp := dm.Get(c)

	status, err := bootstrap.GetStatus(dp)
	if err != nil {
		return err
	}

	return c.JSON(status)
}
