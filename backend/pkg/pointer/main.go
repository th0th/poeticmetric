package pointer

func Get[T any](v T) *T {
	return &v
}

func StringOrNil(v string) *string {
	if v == "" {
		return nil
	}

	return &v
}
