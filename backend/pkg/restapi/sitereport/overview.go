package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/siteoverviewreport"
)

func overview(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := siteoverviewreport.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
