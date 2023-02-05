package restapi

import (
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/bootstrap"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/event"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/authentication"
	depotmiddleware "github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/organization"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/root"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/site"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/sitereport"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/stripe"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/user"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/useraccesstoken"
)

func New(dp *depot.Depot) *fiber.App {
	app := fiber.New(fiber.Config{ErrorHandler: errorHandler})

	app.Use(recover.New(recover.Config{EnableStackTrace: true}))
	app.Use(logger.New())
	app.Use(cors.New())
	app.Use(fibersentry.New(fibersentry.Config{Repanic: true, WaitForDelivery: true}))
	app.Use(depotmiddleware.New(dp))

	bootstrap.Add(app)
	root.Add(app)

	app.Use(authentication.New())
	app.Use(authentication.NewUserBasicAuth())
	app.Use(authentication.NewUserAccessTokenAuth())

	event.Add(app)
	organization.Add(app)
	site.Add(app)
	sitereport.Add(app)
	stripe.Add(app)
	user.Add(app)
	useraccesstoken.Add(app)

	return app
}
