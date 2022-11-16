package sitereport

import (
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
)

const localsFiltersKey = "filters"

func Add(app *fiber.App) {
	group := app.Group("/site-reports", filtersMiddleware)

	group.Get("/overview", overview)
	group.Get("/page-views-time", pageViewsTime)
	group.Get("/page-view-counts", pageViewCounts)
	group.Get("/page-view-durations", pageViewDurations)
	group.Get("/visitors-time", visitorsTime)
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
