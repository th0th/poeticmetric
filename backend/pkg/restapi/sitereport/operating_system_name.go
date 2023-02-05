package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/operatingsystemname"
)

func operatingSystemName(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := operatingsystemname.Get(dp, getFilters(c), getPaginationCursor[operatingsystemname.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
