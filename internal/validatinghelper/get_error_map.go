package validatinghelper

import v "github.com/RussellLuo/validating/v3"

func GetErrorsMap(validationErrs v.Errors) map[string]string {
	m := map[string]string{}

	for _, validationError := range validationErrs {
		m[validationError.Field()] = validationError.Message()
	}

	return m
}
