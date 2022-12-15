package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	country2 "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/country"
)

func country(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := country2.Get(dp, getFilters(c), getPaginationCursor[country2.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
