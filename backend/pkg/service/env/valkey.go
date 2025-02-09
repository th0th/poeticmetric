package env

import (
	"fmt"

	govalkey "github.com/valkey-io/valkey-go"
)

func (s *service) ValkeyAddr() string {
	return fmt.Sprintf("%s:%d", s.vars.ValkeyHost, s.vars.ValkeyPort)
}

func (s *service) ValkeyClientOption() govalkey.ClientOption {
	return govalkey.ClientOption{
		InitAddress: []string{fmt.Sprintf("%s:%d", s.vars.ValkeyHost, s.vars.ValkeyPort)},
		Password:    s.vars.ValkeyPassword,
	}
}

func (s *service) ValkeyPassword() string {
	return s.vars.ValkeyPassword
}
