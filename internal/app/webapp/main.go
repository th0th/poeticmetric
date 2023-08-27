package webapp

import (
	"context"
	"path"

	"github.com/go-errors/errors"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"

	"github.com/th0th/poeticmetric/internal/app/webapp/htmlengine"
	am "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication"
	um "github.com/th0th/poeticmetric/internal/app/webapp/middleware/authentication/usersessiontoken"
	"github.com/th0th/poeticmetric/internal/app/webapp/middleware/colormode"
	cm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/context"
	"github.com/th0th/poeticmetric/internal/app/webapp/middleware/fibercontext"
	sm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/session"
	tm "github.com/th0th/poeticmetric/internal/app/webapp/middleware/toast"
	"github.com/th0th/poeticmetric/internal/app/webapp/route/auth"
	"github.com/th0th/poeticmetric/internal/app/webapp/route/marketing"
	"github.com/th0th/poeticmetric/internal/env"
)

type WebApp struct {
	app *fiber.App
}

func New() *WebApp {
	app := fiber.New(fiber.Config{
		//ErrorHandler:      handleError,
		PassLocalsToViews: true,
		Views:             htmlengine.New(),
		ViewsLayout:       "layouts/main",
	})

	ctx := context.Background()
	ss := session.New()

	app.Use(
		cm.New(ctx),
		fibercontext.New,
		sm.New(ss),
		am.New,
		um.New,
		colormode.New,
		tm.New,
	)

	marketing.Add(app)
	auth.Add(app)

	app.Static("", path.Join(env.Get().BasePath, "public"))
	app.Static("", path.Join(env.Get().BasePath, "public-generated"))

	return &WebApp{
		app: app,
	}
}

func (wa *WebApp) Run() error {
	err := wa.app.Listen(":80")
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
