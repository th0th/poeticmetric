package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/siteutmtermreport"
)

func utmTerm(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := siteutmtermreport.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
