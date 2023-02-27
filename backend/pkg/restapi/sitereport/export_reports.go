package sitereport

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	export2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/export"
)

func exportReports(c *fiber.Ctx) error {
	dp := dm.Get(c)

	filters := getFilters(c)

	zipFileName, zipFileContent, err := export2.Reports(dp, filters)
	if err != nil {
		return err
	}

	c.Set(fiber.HeaderContentDisposition, fmt.Sprintf(`attachment; filename="%s.zip"`, *zipFileName))

	return c.Send(zipFileContent.Bytes())
}
