package validator

import (
	"net/url"
)

func Url(v string) bool {
	u, err := url.ParseRequestURI(v)

	return err == nil &&
		(u.Scheme == "http" || u.Scheme == "https") &&
		u.Host != ""
}
