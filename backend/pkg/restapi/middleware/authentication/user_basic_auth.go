package authentication

import (
	"encoding/base64"
	"errors"
	"strconv"
	"strings"

	"github.com/getsentry/sentry-go"
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func NewUserBasicAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		dp := dm.Get(c)

		authorizationHeader := c.Get("authorization")

		if !strings.HasPrefix(strings.ToLower(authorizationHeader), "basic ") {
			return c.Next()
		}

		base64String := authorizationHeader[6:]

		credentialsByte, err := base64.StdEncoding.DecodeString(base64String)
		if err != nil {
			return fiber.ErrUnauthorized
		}

		credentials := strings.SplitN(string(credentialsByte), ":", 2)

		if len(credentials) != 2 {
			return fiber.ErrUnauthorized
		}

		email := credentials[0]
		password := credentials[1]

		modelUser := &model.User{}

		err = dp.Postgres().
			Model(&model.User{}).
			Where("is_active is true").
			Where("password is not null").
			Where("email = ?", email).
			First(modelUser).
			Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fiber.ErrUnauthorized
			}

			return err
		}

		if bcrypt.CompareHashAndPassword([]byte(*modelUser.Password), []byte(password)) != nil {
			return fiber.ErrUnauthorized
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
			Kind:         pointer.Get(AuthKindRestApiUserBasic),
			Organization: modelOrganization,
			User:         modelUser,
		})

		fibersentry.GetHubFromContext(c).Scope().SetUser(sentry.User{
			Email: modelUser.Email,
			ID:    strconv.Itoa(int(modelUser.Id)),
		})

		return c.Next()
	}
}
