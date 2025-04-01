package parser

import (
	"net/http"
	"strconv"

	"github.com/go-errors/errors"
)

func QueryValue[T any](r *http.Request, name string) (T, error) {
	var defaultValue T

	queryValue := r.URL.Query().Get(name)

	var value any
	var err error

	switch any(defaultValue).(type) {
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
		return defaultValue, errors.New("unsupported type")
	}

	if err != nil {
		return defaultValue, errors.Wrap(err, 0)
	} else {
		return value.(T), nil
	}
}
