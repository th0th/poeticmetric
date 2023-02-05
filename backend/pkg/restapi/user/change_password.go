package user

import (
	"github.com/gofiber/fiber/v2"
	am "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func changePassword(c *fiber.Ctx) error {
	auth := am.Get(c)
	dp := dm.Get(c)

	payload := &userself.ChangePasswordPayload{}

	err := c.BodyParser(payload)
	if err != nil {
		return err
	}

	user, userAccessToken, err := userself.ChangePassword(dp, auth.User.Id, payload)
	if err != nil {
		return err
	}

	return c.JSON(map[string]any{
		"user":            user,
		"userAccessToken": userAccessToken,
	})
}
