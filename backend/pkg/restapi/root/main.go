package root

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/frontend"
	tracker2 "github.com/poeticmetric/poeticmetric/backend/pkg/tracker"
)

func Add(app *fiber.App) {
	app.Get("/", index)
	app.Get("/pm.js", tracker)
}

func index(c *fiber.Ctx) error {
	return c.Redirect(fmt.Sprintf("%s%s", c.Protocol(), frontend.GenerateUrl("/")))
}

func tracker(c *fiber.Ctx) error {
	c.Set("content-type", "application/javascript")

	return c.SendString(tracker2.Get())
}
