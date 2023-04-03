package authentication

import (
	"errors"
	"log"
	"strconv"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
)

func NewUserAccessTokenFormAuth(c *fiber.Ctx) error {
	dateTime := time.Now()

	dp := dm.Get(c)

	userAccessToken := c.FormValue("user-access-token")

	if userAccessToken == "" {
		return c.Next()
	}

	modelUserAccessToken := &model.UserAccessToken{}

	err := dp.Postgres().
		Model(&model.UserAccessToken{}).
		Where("token = ?", userAccessToken).
		First(modelUserAccessToken).
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fiber.ErrUnauthorized
		}

		return err
	}

	modelUser := &model.User{}

	err = dp.Postgres().
		Model(&model.User{}).
		Where("is_active is true").
		Where("id = ?", modelUserAccessToken.UserId).
		First(modelUser).
		Error
	if err != nil {
		return err
	}

	modelOrganization := &model.Organization{}

	err = dp.Postgres().
		Model(&model.Organization{}).
		Joins("Plan").
		Where("organizations.id = ?", modelUser.OrganizationId).
		First(modelOrganization).
		Error
	if err != nil {
		return err
	}

	c.Locals("auth", &Auth{
		Kind:            pointer.Get(AuthKindRestApiUserAccessToken),
		Organization:    modelOrganization,
		User:            modelUser,
		UserAccessToken: modelUserAccessToken,
	})

	fibersentry.GetHubFromContext(c).Scope().SetUser(sentry.User{
		Email: modelUser.Email,
		ID:    strconv.Itoa(int(modelUser.Id)),
	})

	err = dp.Redis().
		Set(depot.Ctx, modelUserAccessToken.LastUsedAtRedisKey(), dateTime.Unix(), time.Hour).
		Err()
	if err != nil {
		// TODO: handle the error better
		log.Println(err)
	}

	return c.Next()
}
