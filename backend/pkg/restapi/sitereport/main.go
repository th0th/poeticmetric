package sitereport

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
)

const localsFiltersKey = "filters"

func Add(app *fiber.App) {
	group := app.Group("/site-reports", filtersMiddleware)

	group.Get("/browser-name", browserName)
	group.Get("/browser-version", browserVersion)
	group.Get("/country", country)
	group.Get("/device-type", deviceType)
	group.Get("/language", language)
	group.Get("/operating-system-name", operatingSystemName)
	group.Get("/operating-system-version", operatingSystemVersion)
	group.Get("/overview", overview)
	group.Get("/page-view", pageView)
	group.Get("/page-view-count", pageViewCount)
	group.Get("/page-view-duration", pageViewDuration)
	group.Get("/referrer-page", referrerPage)
	group.Get("/referrer-domain", referrerDomain)
	group.Get("/visitor", visitor)
}

func getFilters(c *fiber.Ctx) *sitereportfilters.Filters {
	return c.Locals(localsFiltersKey).(*sitereportfilters.Filters)
}

func filtersMiddleware(c *fiber.Ctx) error {
	filters := &sitereportfilters.Filters{}

	err := c.QueryParser(filters)
	if err != nil {
		return err
	}

	c.Locals(localsFiltersKey, filters)

	return c.Next()
}
