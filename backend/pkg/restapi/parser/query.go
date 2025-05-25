package parser

import (
	"net/http"
	"strconv"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func QueryValue[T any](r *http.Request, name string, defaultValue *T) (T, error) {
	var zeroValue T

	queryValue := r.URL.Query().Get(name)

	if queryValue == "" && defaultValue != nil {
		return *defaultValue, nil
	}

	var value any
	var err error

	switch any(zeroValue).(type) {
	case int:
		intValue, parseErr := strconv.ParseInt(queryValue, 10, 64)
		if parseErr != nil {
			err = errors.Wrap(parseErr, 0)
		} else {
			value = int(intValue)
		}
	case string:
		value = queryValue
	case uint:
		uint64Value, parseErr := strconv.ParseUint(queryValue, 10, 64)
		if parseErr != nil {
			err = errors.Wrap(parseErr, 0)
		} else {
			value = uint(uint64Value)
		}
	default:
		return zeroValue, errors.Wrap(poeticmetric.ErrUnsupportedType, 0)
	}

	if err != nil {
		return zeroValue, errors.Wrap(err, 0)
	} else {
		return value.(T), nil
	}
}
