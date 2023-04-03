package sitereport

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	country2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/country"
)

func country(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := country2.Get(dp, getFilters(c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
