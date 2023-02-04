package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/useraccesstoken"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func verifyEmailAddress(c *fiber.Ctx) error {
	dp := dm.Get(c)

	payload := &userself.VerifyEmailAddressPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	userSelf := &userself.UserSelf{}
	userAccessToken := &useraccesstoken.UserAccessToken{}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		var err2 error

		userSelf, err2 = userself.VerifyEmailAddress(dp, payload)
		if err2 != nil {
			return err2
		}

		userAccessToken, err2 = useraccesstoken.Create(dp, userSelf.Id)
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return err
	}

	return c.JSON(map[string]any{
		"user":            userSelf,
		"userAccessToken": userAccessToken,
	})
}
