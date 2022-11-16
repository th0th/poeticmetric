package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitepageviewcountsreport"
)

func pageViewCounts(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := sitepageviewcountsreport.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
