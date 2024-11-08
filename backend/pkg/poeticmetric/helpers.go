package poeticmetric

import (
	"fmt"
	"reflect"
)

func StringSlice[T any](s []T) []string {
	stringSlice := make([]string, len(s))

	for i, v := range s {
		stringSlice[i] = fmt.Sprintf("%v", v)
	}

	return stringSlice
}

func Pointer[T any](x T) *T {
	return &x
}

func PointerOrNil[T any](x T) *T {
	if reflect.ValueOf(x).IsZero() {
		return nil
	}

	return &x
}
