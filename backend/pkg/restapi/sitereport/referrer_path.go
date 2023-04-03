package sitereport

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrerpath"
)

func referrerPath(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := referrerpath.Get(dp, getFilters(c), getPaginationCursor[referrerpath.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
