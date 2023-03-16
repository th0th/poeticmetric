package sitereport

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/googlesearchquery"
)

func googleSearchQuery(c *fiber.Ctx) error {
	dp := dm.Get(c)

	report, err := googlesearchquery.Get(dp, getFilters(c), pointer.Get(uint64(c.QueryInt("page"))))
	if err != nil {
		return err
	}

	return c.JSON(report)
}
