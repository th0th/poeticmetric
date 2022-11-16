package validator

import "regexp"

const (
	DomainRegexpPattern = "^([a-zA-Z0-9]{1}[a-zA-Z0-9_-]{0,62})(\\.[a-zA-Z0-9_]{1}[a-zA-Z0-9_-]{0,62})*?(\\.[a-zA-Z]{1}[a-zA-Z0-9]{0,62})\\.?$"
)

func Domain(v string) bool {
	m, err := regexp.MatchString(DomainRegexpPattern, v)
	if err != nil {
		panic(err)
	}

	return m
}
