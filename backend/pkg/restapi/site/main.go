package site

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/sites", permission.UserAuthenticated)

	group.Get("/", list)
	group.Get("/:id", read)
	group.Post("/", create)
	group.Patch("/:id", update)
	group.Delete("/:id", destroy)
}
