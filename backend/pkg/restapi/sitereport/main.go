package sitereport

import (
	"encoding/json"
	"fmt"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/browsername"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/browserversion"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/operatingsystemname"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/operatingsystemversion"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmcampaign"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmcontent"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmmedium"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmsource"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/utmterm"

	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	language2 "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/language"
	path2 "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/path"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/referrerpath"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/referrersite"
)

const localsFiltersKey = "filters"
const localsPaginationCursorKey = "paginationCursor"

func Add(app *fiber.App) {
	group := app.Group("/site-reports", filtersMiddleware)

	group.Get("/browser-name", paginationCursorMiddleware[browsername.PaginationCursor], browserName)
	group.Get("/browser-version", paginationCursorMiddleware[browserversion.PaginationCursor], browserVersion)
	group.Get("/country", country)
	group.Get("/device-type", deviceType)
	group.Get("/language", paginationCursorMiddleware[language2.PaginationCursor], language)
	group.Get("/operating-system-name", paginationCursorMiddleware[operatingsystemname.PaginationCursor], operatingSystemName)
	group.Get("/operating-system-version", paginationCursorMiddleware[operatingsystemversion.PaginationCursor], operatingSystemVersion)
	group.Get("/overview", overview)
	group.Get("/page-view", pageView)
	group.Get("/page-view-trends", pageViewTrends)
	group.Get("/path-duration", pathDuration)
	group.Get("/path", paginationCursorMiddleware[path2.PaginationCursor], path)
	group.Get("/referrer-path", paginationCursorMiddleware[referrerpath.PaginationCursor], referrerPath)
	group.Get("/referrer-site", paginationCursorMiddleware[referrersite.PaginationCursor], referrerSite)
	group.Get("/utm-campaign", paginationCursorMiddleware[utmcampaign.PaginationCursor], utmCampaign)
	group.Get("/utm-content", paginationCursorMiddleware[utmcontent.PaginationCursor], utmContent)
	group.Get("/utm-medium", paginationCursorMiddleware[utmmedium.PaginationCursor], utmMedium)
	group.Get("/utm-source", paginationCursorMiddleware[utmsource.PaginationCursor], utmSource)
	group.Get("/utm-term", paginationCursorMiddleware[utmterm.PaginationCursor], utmTerm)
	group.Get("/visitor", visitor)
	group.Get("/visitor-page-view", visitorPageView)
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

func paginationCursorMiddleware[T any](c *fiber.Ctx) error {
	var err error

	paginationCursorString := c.Query("paginationCursor")

	if paginationCursorString != "" {
		var paginationCursor T

		err = json.Unmarshal([]byte(fmt.Sprintf(`"%s"`, paginationCursorString)), &paginationCursor)
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
