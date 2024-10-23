package analytics

import (
	"reflect"
)

func Pointer[T any](x T) *T {
	return &x
}

func PointerOrNil[T any](x T) *T {
	if reflect.ValueOf(x).IsZero() {
		return nil
	}

	return &x
}
