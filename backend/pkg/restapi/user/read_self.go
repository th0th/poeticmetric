package user

import (
	"github.com/gofiber/fiber/v2"

	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func readSelf(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	u, err := userself.Read(dp, auth.User.Id)
	if err != nil {
		return err
	}

	return c.JSON(u)
}
