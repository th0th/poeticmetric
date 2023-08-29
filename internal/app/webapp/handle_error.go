package webapp

import (
	"fmt"
	"log"

	"github.com/go-errors/errors"
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"

	"github.com/th0th/poeticmetric/internal/env"
)

func handleError(c *fiber.Ctx, err error) error {
	payload := fiber.Map{}

	fmt.Printf("%v\n", err)

	code := fiber.StatusInternalServerError

	var e *fiber.Error
	if errors.As(err, &e) {
		code = e.Code
	}

	if code == fiber.StatusNotFound {
		return c.Status(code).Render("error/404", payload)
	}

	hub := fibersentry.GetHubFromContext(c)
	hub.CaptureException(err)

	if env.Get().Debug {
		var wrappedError *errors.Error
		if errors.As(err, &wrappedError) {
			log.Println(wrappedError.ErrorStack())
		}

		return c.
			Status(fiber.StatusInternalServerError).
			SendString(err.Error())
	}

	return c.Status(code).Render("error/500", payload)
}
