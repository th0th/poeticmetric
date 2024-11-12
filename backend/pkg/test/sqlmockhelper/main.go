package sqlmockhelper

import (
	"database/sql/driver"
)

type ValueArg struct {
	Value driver.Value
}

func (a *ValueArg) Match(value driver.Value) bool {
	a.Value = value

	return true
}

type CustomConverter struct{}

func (s CustomConverter) ConvertValue(v any) (driver.Value, error) {
	return v, nil
}
