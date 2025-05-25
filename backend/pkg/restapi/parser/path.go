package parser

import (
	"net/http"
	"strconv"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func PathValue[T any](r *http.Request, name string) (T, error) {
	var defaultValue T

	pathValue := r.PathValue(name)

	var value any
	var err error

	switch any(defaultValue).(type) {
	case string:
		value = pathValue
	case uint:
		uint64Value, parseErr := strconv.ParseUint(pathValue, 10, 64)
		if parseErr != nil {
			err = errors.Wrap(parseErr, 0)
		} else {
			value = uint(uint64Value)
		}
	default:
		return defaultValue, errors.Wrap(poeticmetric.ErrUnsupportedType, 0)
	}

	if err != nil {
		return defaultValue, errors.Wrap(err, 0)
	} else {
		return value.(T), nil
	}
}
