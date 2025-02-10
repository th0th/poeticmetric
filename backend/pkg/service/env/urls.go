package env

import (
	"fmt"
)

func (s *service) FrontendURL(path string) string {
	return fmt.Sprintf("%s%s", s.vars.FrontendBaseURL, path)
}

func (s *service) RESTApiURL(path string) string {
	return fmt.Sprintf("%s%s", s.vars.RESTApiBaseURL, path)
}
