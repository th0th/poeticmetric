package sitereport

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/th0th/poeticmetric/backend/pkg/model"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/permission"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/browsername"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/browserversion"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/operatingsystemname"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/operatingsystemversion"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmcampaign"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmcontent"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmmedium"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmsource"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmterm"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	language2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/language"
	path2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/path"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrerpath"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrersite"
)

const localsFiltersKey = "filters"
const localsPaginationCursorKey = "paginationCursor"

func Add(app *fiber.App) {
	group := app.Group("/site-reports", filtersMiddleware, authenticatedOrPublicMiddleware)

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
	group.Get("/path", paginationCursorMiddleware[path2.PaginationCursor], path)
	group.Get("/referrer-path", paginationCursorMiddleware[referrerpath.PaginationCursor], referrerPath)
	group.Get("/referrer-site", paginationCursorMiddleware[referrersite.PaginationCursor], referrerSite)
	group.Get("/utm-campaign", paginationCursorMiddleware[utmcampaign.PaginationCursor], utmCampaign)
	group.Get("/utm-content", paginationCursorMiddleware[utmcontent.PaginationCursor], utmContent)
	group.Get("/utm-medium", paginationCursorMiddleware[utmmedium.PaginationCursor], utmMedium)
	group.Get("/utm-source", paginationCursorMiddleware[utmsource.PaginationCursor], utmSource)
	group.Get("/utm-term", paginationCursorMiddleware[utmterm.PaginationCursor], utmTerm)
	group.Get("/visitor", visitor)
	group.Get("/visitor-trends", visitorTrends)
}

func authenticatedOrPublicMiddleware(c *fiber.Ctx) error {
	dp := dm.Get(c)

	modelSite := &model.Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Select("is_public").
		Where("id = ?", getFilters(c).SiteId).
		First(modelSite).
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.ErrNotFound
		}

		return err
	}

	if modelSite.IsPublic {
		return c.Next()
	}

	return permission.UserAuthenticated(c)
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
