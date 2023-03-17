package sitereport

import (
	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/googlesearchquery"
)

func googleSearchQuery(c *fiber.Ctx) error {
	dp := dm.Get(c)
	auth := am.Get(c)

	filters := getFilters(c)

	modelSite := &model.Site{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Select("google_search_console_site_url").
		Where("id = ?", filters.SiteId).
		First(modelSite).
		Error
	if err != nil {
		return fiber.ErrNotFound
	}

	if auth.Organization.GoogleOauthRefreshToken == nil || modelSite.GoogleSearchConsoleSiteUrl == nil {
		return c.Status(fiber.StatusBadRequest).JSON(helpers.Detail("You need to enable Google Search Console integration first."))
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
