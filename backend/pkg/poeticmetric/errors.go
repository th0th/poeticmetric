package poeticmetric

import (
	"errors"
)

var (
	ErrCantDeleteOwnerUser                   = errors.New("can't delete owner user")
	ErrEmailAddressAlreadyVerified           = errors.New("email address already verified")
	ErrNoDefaultPlan                         = errors.New("no default plan")
	ErrNoOrganizationGoogleOauthRefreshToken = errors.New("organization doesn't have a google oauth refresh token")
	ErrNotFound                              = errors.New("not found")
	ErrUserAlreadyVerifiedEmail              = errors.New("user already verified email")
)
