package auth

import (
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/app/webapp/middleware/permission"
)

func Add(r fiber.Router) {
	r.Get("/bootstrap", bootstrap).Name("auth.bootstrap")
	r.Get("/sign-up", signUp).Name("auth.signUp")
	r.Get("/sign-in", signIn).Name("auth.signIn")
	r.Get("/sign-out", permission.Authenticated, signOut).Name("auth.signOut")

	r.Post("/bootstrap", bootstrap)
	r.Post("/sign-in", signIn)
}
