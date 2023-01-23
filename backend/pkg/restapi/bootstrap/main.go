package bootstrap

import "github.com/gofiber/fiber/v2"

func Add(group *fiber.App) {
	group.Post("/bootstrap", bootstrap)
}
