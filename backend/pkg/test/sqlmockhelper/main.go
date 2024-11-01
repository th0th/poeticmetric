package sqlmockhelper

import (
	"database/sql/driver"
)

type AnyValue struct {
	Value driver.Value
}

func (a *AnyValue) Match(value driver.Value) bool {
	a.Value = value

	return true
}
