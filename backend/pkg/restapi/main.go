package restapi

import (
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/authentication"
	depotmiddleware "github.com/poeticmetric/poeticmetric/backend/pkg/restapi/middleware/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/organization"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/root"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/site"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/sitereport"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/stripe"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/user"
	"github.com/poeticmetric/poeticmetric/backend/pkg/restapi/useraccesstoken"
)

func New(dp *depot.Depot) *fiber.App {
	app := fiber.New(fiber.Config{ErrorHandler: errorHandler})

	app.Use(recover.New(recover.Config{EnableStackTrace: true}))
	app.Use(logger.New())
	app.Use(cors.New())
	app.Use(fibersentry.New(fibersentry.Config{Repanic: true, WaitForDelivery: true}))
	app.Use(depotmiddleware.New(dp))
	app.Use(authentication.New())
	app.Use(authentication.NewUserBasicAuth())
	app.Use(authentication.NewUserAccessTokenAuth())

	organization.Add(app)
	root.Add(app)
	site.Add(app)
	sitereport.Add(app)
	stripe.Add(app)
	user.Add(app)
	useraccesstoken.Add(app)

	return app
}
