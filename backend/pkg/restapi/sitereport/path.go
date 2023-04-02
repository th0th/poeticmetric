package sitereport

import (
	"github.com/gofiber/fiber/v2"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	sitepathreport "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/path"
)

func path(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := sitepathreport.Get(dp, getFilters(c), getPaginationCursor[sitepathreport.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
