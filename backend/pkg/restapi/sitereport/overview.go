package sitereport

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	overview2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/overview"
)

func overview(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := overview2.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
