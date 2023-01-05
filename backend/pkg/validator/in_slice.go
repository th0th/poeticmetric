package validator

func InSlice[T comparable](s []T, v T) bool {
	m := map[T]bool{}

	for _, i := range s {
		m[i] = true
	}

	return m[v]
}
