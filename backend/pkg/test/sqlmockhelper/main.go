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
