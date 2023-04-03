package sitereport

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/browsername"
)

func browserName(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := browsername.Get(dp, getFilters(c), getPaginationCursor[browsername.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
