package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmterm"
)

func utmTerm(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := utmterm.Get(dp, getFilters(c), getPaginationCursor[utmterm.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
