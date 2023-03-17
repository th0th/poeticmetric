package restapi

import (
	"errors"
	"fmt"
	"log"

	v "github.com/RussellLuo/validating/v3"
	errors2 "github.com/go-errors/errors"
	"github.com/gofiber/contrib/fibersentry"
	"github.com/gofiber/fiber/v2"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/helpers"
)

func errorHandler(c *fiber.Ctx, err error) error {
	var validationErrors v.Errors
	if errors.As(err, &validationErrors) {
		r := map[string]string{}

		for _, validationError := range validationErrors {
			r[validationError.Field()] = validationError.Message()
		}

		return c.Status(fiber.StatusUnprocessableEntity).JSON(r)
	}

	var fiberUnmarshalTypeError *fiber.UnmarshalTypeError
	if errors.As(err, &fiberUnmarshalTypeError) {
		log.Println(fiberUnmarshalTypeError.Error())

		r := map[string]string{
			fiberUnmarshalTypeError.Field: fmt.Sprintf(
				"This value must be %s, not %s.",
				fiberUnmarshalTypeError.Type.String(),
				fiberUnmarshalTypeError.Value,
			),
		}

		return c.Status(fiber.StatusUnprocessableEntity).JSON(r)
	}

	var fiberSyntaxError *fiber.SyntaxError
	if errors.As(err, &fiberSyntaxError) {
		return c.
			Status(fiber.StatusBadRequest).
			JSON(helpers.Detail("Couldn't parse the JSON."))
	}

	var fiberError *fiber.Error
	if errors.As(err, &fiberError) {
		if fiberError.Code == fiber.StatusNotFound {
			return c.
				Status(fiber.StatusNotFound).
				JSON(helpers.Detail("Not found."))
		}

		if fiberError.Code == fiber.StatusUnauthorized {
			c.Set(fiber.HeaderWWWAuthenticate, "Basic realm=\"Please sign in\"")

			return c.
				Status(fiber.StatusUnauthorized).
				JSON(helpers.Detail("Invalid credentials."))
		}

		if fiberError.Code == fiber.StatusForbidden {
			return c.
				Status(fiber.StatusForbidden).
				JSON(helpers.Detail("Permission denied."))
		}

		return c.
			Status(fiberError.Code).
			JSON(helpers.Detail(fiberError.Error()))
	}

	var fiberMultiError fiber.MultiError
	if errors.As(err, &fiberMultiError) {
		r := map[string]string{}

		for key, err2 := range fiberMultiError {
			var fiberConversionError fiber.ConversionError
			if errors.As(err2, &fiberConversionError) {
				r[key] = fmt.Sprintf("This value should be %s.", fiberConversionError.Type.String())
			} else {
				r[key] = err2.Error()
			}
		}

		return c.
			Status(fiber.StatusBadRequest).
			JSON(r)
	}

	log.Printf("An error has occurred: %v", err)

	fibersentry.GetHubFromContext(c).CaptureException(err)

	if env.GetDebug() {
		var wrappedError *errors2.Error
		if errors.As(err, &wrappedError) {
			log.Println(wrappedError.ErrorStack())
		}

		return c.
			Status(fiber.StatusInternalServerError).
			SendString(err.Error())
	}

	return err
}
