package site

import (
	"github.com/gofiber/fiber/v2"

	sm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/section"
)

func Add(router fiber.Router) {
	group := router.Group("/sites", sm.New(sm.App))

	group.Get("", list).Name("site.list")
	group.Get("/add", add).Name("site.add")
	group.Get("/google-search-console-site-select", googleSearchConsoleSiteSelect).Name("site.googleSearchConsoleSiteSelect")

	group.Post("/add", add)

	siteGroup := group.Group("/:site_id")

	siteGroup.Get("/edit", edit).Name("site.edit")

	siteGroup.Post("/edit", edit)
}
