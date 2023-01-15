package stripe

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
)

func Add(app *fiber.App) {
	g := app.Group("/stripe")

	if env.GetIsHosted() {
		g.Post("/webhook", webhook)
	}
}
