package sitereport

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/googlesearchquery"
)

func googleSearchQuery(c *fiber.Ctx) error {
	dp := dm.Get(c)

	filters := getFilters(c)

	data := &struct {
		OrganizationGoogleOauthRefreshToken *string
		SiteGoogleSearchConsoleSiteUrl      *string
	}{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Joins("inner join organizations on organizations.id = sites.organization_id").
		Select(
			"organizations.google_oauth_refresh_token as organization_google_oauth_refresh_token",
			"sites.google_search_console_site_url as site_google_search_console_site_url",
		).
		Where("sites.id = ?", filters.SiteId).
		First(data).
		Error
	if err != nil {
		return fiber.ErrNotFound
	}

	if data.OrganizationGoogleOauthRefreshToken == nil || data.SiteGoogleSearchConsoleSiteUrl == nil {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("Google Search Console integration should be enabled to use this endpoint."))
	}

	report, err := googlesearchquery.Get(dp, getFilters(c), pointer.Get(uint64(c.QueryInt("page"))))
	if err != nil {
		if errors.Is(err, sitereport.ErrInvalidGoogleOauthToken) {
			return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("Please re-authenticate with Google."))
		}

		return err
	}

	return c.JSON(report)
}
