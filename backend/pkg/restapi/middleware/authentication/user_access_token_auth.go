package authentication

import (
	"errors"
	"github.com/getsentry/sentry-go"
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	dm "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"gorm.io/gorm"
	"log"
	"strconv"
	"strings"
	"time"
)

func NewUserAccessTokenAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		dateTime := time.Now()

		dp := dm.Get(c)

		authorizationHeader := c.Get("authorization")

		if !strings.HasPrefix(strings.ToLower(authorizationHeader), "bearer ") {
			return c.Next()
		}

		modelUserAccessToken := &model.UserAccessToken{}

		err := dp.Postgres().
			Model(&model.UserAccessToken{}).
			Where("token = ?", authorizationHeader[7:]).
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
			Where("is_active is true").
			Where("id = ?", modelUserAccessToken.UserId).
			First(modelUser).
			Error
		if err != nil {
			return err
		}

		modelOrganization := &model.Organization{}

		err = dp.Postgres().
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
}
