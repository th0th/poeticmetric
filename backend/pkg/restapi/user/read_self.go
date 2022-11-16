package user

import (
	"github.com/gofiber/fiber/v2"
	am "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/userself"
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
