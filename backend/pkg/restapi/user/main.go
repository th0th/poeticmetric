package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/users")

	group.Get("/", permission.UserAuthenticated, list)
	group.Get("/me", permission.UserAuthenticated, readSelf)
	group.Patch("/me", permission.UserAuthenticated, updateSelf)
	group.Post("/change-password", permission.UserBasicAuthenticated, changePassword)
}
