package site

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/sites")

	group.Get("/public/:domain", readPublic)

	group.Use(permission.UserAuthenticated)

	group.Get("/", list)
	group.Post("/", create)

	group.Get("/:id", read)
	group.Delete("/:id", destroy)
	group.Patch("/:id", update)
}
