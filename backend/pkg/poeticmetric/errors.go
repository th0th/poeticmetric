package poeticmetric

import (
	"errors"
)

var (
	ErrCantDeleteOwnerUser                   = errors.New("can't delete owner user")
	ErrNoOrganizationGoogleOauthRefreshToken = errors.New("organization doesn't have a google oauth refresh token")
	ErrNotFound                              = errors.New("not found")
)
