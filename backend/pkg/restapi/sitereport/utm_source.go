package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/siteutmsourcereport"
)

func utmSource(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := siteutmsourcereport.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
