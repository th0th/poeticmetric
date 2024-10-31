package validation

import (
	"github.com/go-playground/validator/v10"
)

func New() *validator.Validate {
	return validator.New(validator.WithRequiredStructEnabled())
}
