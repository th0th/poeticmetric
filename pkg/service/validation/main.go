package validation

import (
	"github.com/go-playground/validator/v10"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

type NewParams struct {
}

type service struct {
	validate *validator.Validate
}

func New(params NewParams) poeticmetric.ValidationService {
	validate := validator.New(validator.WithRequiredStructEnabled())

	return &service{
		validate: validate,
	}
}
