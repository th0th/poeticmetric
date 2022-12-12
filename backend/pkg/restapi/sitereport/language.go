package sitereport

import (
	"github.com/gofiber/fiber/v2"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	language2 "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/language"
)

func language(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := language2.Get(dp, getFilters(c), getPaginationCursor[language2.PaginationCursor](c))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
