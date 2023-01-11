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

func StringSlice(v []string) []*string {
	r := make([]*string, len(v))

	for i := range v {
		r[i] = &v[i]
	}

	return r
}
