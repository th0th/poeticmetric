package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pathvisitor"
)

func pathVisitor(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := pathvisitor.Get(dp, getFilters(c), getPaginationCursor[pathvisitor.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
