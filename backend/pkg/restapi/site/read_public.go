package site

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/site"
)

func readPublic(c *fiber.Ctx) error {
	dp := dm.Get(c)

	s, err := site.ReadPublic(dp, c.Params("domain"))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.ErrNotFound
		}

		return err
	}

	return c.JSON(s)
}
