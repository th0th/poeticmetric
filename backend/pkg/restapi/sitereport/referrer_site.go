package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrersite"
)

func referrerSite(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := referrersite.Get(dp, getFilters(c), getPaginationCursor[referrersite.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
