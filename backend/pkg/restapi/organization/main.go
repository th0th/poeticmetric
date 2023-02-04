package organization

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/organization")
	group.Get("/", permission.UserAuthenticated, read)
	group.Patch("/", permission.UserOwner, update)

	if env.GetIsHosted() {
		group.Delete("/", permission.UserBasicAuthenticated, permission.UserOwner, destroy)
		group.Post("/stripe-billing-portal-session", permission.UserOwner, createStripeBillingPortalSession)
		group.Post("/stripe-checkout-session", permission.UserOwner, createStripeCheckoutSession)
	}
}
