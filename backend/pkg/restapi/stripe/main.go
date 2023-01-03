package stripe

import "github.com/gofiber/fiber/v2"

func Add(app *fiber.App) {
	g := app.Group("/stripe")

	g.Post("/webhook", webhook)
}
