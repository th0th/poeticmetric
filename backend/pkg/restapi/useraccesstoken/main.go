package useraccesstoken

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/user-access-tokens")

	group.Delete("/", permission.UserAccessTokenAuthenticated, destroy)
	group.Get("/", permission.UserAuthenticated, list)
	group.Post("/", permission.UserBasicAuthenticated, create)
}
