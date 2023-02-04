package useraccesstoken

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	depotmiddleware "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/useraccesstoken"
)

func destroy(c *fiber.Ctx) error {
	err := useraccesstoken.Delete(depotmiddleware.Get(c), authentication.Get(c).UserAccessToken.Id)
	if err != nil {
		return err
	}

	return c.SendStatus(fiber.StatusNoContent)
}
