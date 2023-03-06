package sitereport

import (
	"encoding/json"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/skip"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/permission"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/browsername"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/browserversion"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	language2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/language"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/operatingsystemname"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/operatingsystemversion"
	path2 "github.com/th0th/poeticmetric/backend/pkg/service/sitereport/path"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrerpath"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/referrersite"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmcampaign"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmcontent"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmmedium"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmsource"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/utmterm"
)

const localsFiltersKey = "filters"
const localsPaginationCursorKey = "paginationCursor"

func Add(app *fiber.App) {
	baseGroup := app.Group("/site-reports", filtersMiddleware)

	exportGroup := baseGroup.Use(
		authentication.NewUserAccessTokenFormAuth,
		skip.New(permission.UserAuthenticated, isPublic),
		skip.New(permission.OrganizationSubscription, isPublic),
	)

	exportGroup.Post("/export/reports", exportReports)
	exportGroup.Post("/export/events", exportEvents)

	group := baseGroup.Use(
		skip.New(permission.UserAuthenticated, isPublic),
		skip.New(permission.OrganizationSubscription, isPublic),
	)

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
	group.Get("/time-trends", timeTrends)
	group.Get("/utm-campaign", paginationCursorMiddleware[utmcampaign.PaginationCursor], utmCampaign)
	group.Get("/utm-content", paginationCursorMiddleware[utmcontent.PaginationCursor], utmContent)
	group.Get("/utm-medium", paginationCursorMiddleware[utmmedium.PaginationCursor], utmMedium)
	group.Get("/utm-source", paginationCursorMiddleware[utmsource.PaginationCursor], utmSource)
	group.Get("/utm-term", paginationCursorMiddleware[utmterm.PaginationCursor], utmTerm)
	group.Get("/visitor", visitor)
}

func isPublic(c *fiber.Ctx) bool {
	dp := dm.Get(c)

	modelSite := &model.Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Joins("inner join organizations on organizations.id = sites.organization_id").
		Select("sites.is_public").
		Where("organizations.plan_id is not null").
		Where("sites.id = ?", getFilters(c).SiteId).
		First(modelSite).
		Error

	return err == nil && modelSite.IsPublic
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
