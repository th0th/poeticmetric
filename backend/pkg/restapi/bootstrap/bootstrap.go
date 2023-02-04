package bootstrap

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
	dm "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	bootstrap2 "github.com/th0th/poeticmetric/backend/pkg/service/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/service/useraccesstoken"
	"github.com/th0th/poeticmetric/backend/pkg/service/userself"
)

func bootstrap(c *fiber.Ctx) error {
	dp := dm.Get(c)

	status, err := bootstrap2.GetStatus(dp)
	if err != nil {
		return err
	}

	if !status.IsReady {
		return c.
			Status(fiber.StatusBadRequest).
			JSON(helpers.Detail("Databases are not empty."))
	}

	payload := &bootstrap2.Payload{}

	err = c.BodyParser(payload)
	if err != nil {
		return err
	}

	userSelf := &userself.UserSelf{}

	userAccessToken := &useraccesstoken.UserAccessToken{}

	err = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		var err2 error

		userSelf, err2 = bootstrap2.Run(dp, payload)
		if err2 != nil {
			return err2
		}

		userAccessToken, err2 = useraccesstoken.Create(dp2, userSelf.Id)
		if err2 != nil {
			return err2
		}

		return nil
	})
	if err != nil {
		return err
	}

	return c.Status(fiber.StatusCreated).JSON(map[string]any{
		"user":            userSelf,
		"userAccessToken": userAccessToken,
	})
}
