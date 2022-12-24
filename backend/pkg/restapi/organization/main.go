package organization

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/organization")

	group.Delete("/", permission.UserBasicAuthenticated, permission.UserOwner, destroy)
	group.Get("/", permission.UserAuthenticated, read)
	group.Patch("/", permission.UserOwner, update)
}
