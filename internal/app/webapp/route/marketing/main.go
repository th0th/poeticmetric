package marketing

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/app/webapp/middleware/section"
)

func Add(router fiber.Router) {
	group := router.Group("").Use(section.New(section.Marketing))

	group.Get("", home).Name("marketing.home")
	group.Get("/manifesto", manifesto).Name("marketing.manifesto")
}
