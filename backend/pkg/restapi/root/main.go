package root

import (
	"github.com/gofiber/fiber/v2"
)

func Add(app *fiber.App) {
	app.Get("/", index)
	app.Get("/bootstrap-status", bootstrapStatus)
	app.Get("/pm.js", tracker)
}
