package user

import (
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware/permission"
)

func Add(app *fiber.App) {
	group := app.Group("/users")

	group.Get("/", permission.UserAuthenticated, list)
	group.Get("/me", permission.UserAuthenticated, readSelf)
	group.Patch("/me", permission.UserAuthenticated, updateSelf)
	group.Post("/", permission.UserOwner, invite)
	group.Post("/activate", permission.UserUnauthenticated, activate)
	group.Post("/change-password", permission.UserBasicAuthenticated, changePassword)
	group.Post("/recover-password", permission.UserUnauthenticated, recoverPassword)
	group.Post("/reset-password", permission.UserUnauthenticated, resetPassword)
	group.Post("/sign-up", permission.UserUnauthenticated, signUp)
	group.Post("/verify-email-address", verifyEmailAddress)

	group.Get("/:id", permission.UserAuthenticated, read)
	group.Delete("/:id", permission.UserOwner, destroy)
	group.Patch("/:id", permission.UserOwner, update)
}
