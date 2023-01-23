package root

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/bootstrap"
)

func bootstrapStatus(c *fiber.Ctx) error {
	dp := dm.Get(c)

	status, err := bootstrap.GetStatus(dp)
	if err != nil {
		return err
	}

	return c.JSON(status)
}
