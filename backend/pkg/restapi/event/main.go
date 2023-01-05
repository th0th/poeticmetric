package event

import "github.com/gofiber/fiber/v2"

func Add(app *fiber.App) {
	g := app.Group("/events")

	g.Post("/", createEvent)
}
