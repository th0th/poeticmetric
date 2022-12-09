package sitereport

import (
	"encoding/base64"
	"encoding/json"
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pathvisitor"
)

const localsFiltersKey = "filters"
const localsPaginationCursorKey = "paginationCursor"

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
	group.Get("/page-view-trends", pageViewTrends)
	group.Get("/path-duration", pathDuration)
	group.Get("/path-visitor", paginationCursorMiddleware[pathvisitor.PaginationCursor](), pathVisitor)
	group.Get("/referrer-path", referrerPath)
	group.Get("/referrer-site", referrerSite)
	group.Get("/utm-campaign", utmCampaign)
	group.Get("/utm-content", utmContent)
	group.Get("/utm-medium", utmMedium)
	group.Get("/utm-source", utmSource)
	group.Get("/utm-term", utmTerm)
	group.Get("/visitor", visitor)
	group.Get("/visitor-trends", visitorTrends)
}

func getFilters(c *fiber.Ctx) *filter.Filters {
	return c.Locals(localsFiltersKey).(*filter.Filters)
}

func getPaginationCursor[T any](c *fiber.Ctx) *T {
	cursor := c.Locals(localsPaginationCursorKey)

	if cursor == nil {
		return nil
	}

	return cursor.(*T)
}

func filtersMiddleware(c *fiber.Ctx) error {
	filters := &filter.Filters{}

	err := c.QueryParser(filters)
	if err != nil {
		return err
	}

	c.Locals(localsFiltersKey, filters)

	return c.Next()
}

func paginationCursorMiddleware[T any]() fiber.Handler {
	return func(c *fiber.Ctx) error {
		var err error

		paginationCursorString := c.Query("paginationCursor")

		if paginationCursorString != "" {
			var paginationCursor T

			var paginationCursorByteSlice []byte

			paginationCursorByteSlice, err = base64.StdEncoding.DecodeString(paginationCursorString)
			if err != nil {
				return c.
					Status(fiber.StatusBadRequest).
					JSON(map[string]string{
						"paginationCursor": "Invalid pagination cursor.",
					})
			}

			err = json.Unmarshal(paginationCursorByteSlice, &paginationCursor)
			if err != nil {
				return c.
					Status(fiber.StatusBadRequest).
					JSON(map[string]string{
						"paginationCursor": "Invalid pagination cursor.",
					})
			}

			c.Locals(localsPaginationCursorKey, &paginationCursor)
		}

		return c.Next()
	}
}
