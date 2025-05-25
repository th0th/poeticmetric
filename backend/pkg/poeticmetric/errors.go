package poeticmetric

import (
	"errors"
)

var (
	ErrCantDeleteOwnerUser                   = errors.New("can't delete owner user")
	ErrEmailAddressAlreadyVerified           = errors.New("email address already verified")
	ErrGoogleOAuthConfigMissing              = errors.New("google oauth config missing")
	ErrGoogleOAuthTokenInvalid               = errors.New("google oauth token invalid")
	ErrGoogleOAuthTokenNotSet                = errors.New("google oauth token not set")
	ErrNoDefaultPlan                         = errors.New("no default plan")
	ErrNoOrganizationGoogleOauthRefreshToken = errors.New("organization doesn't have a google oauth refresh token")
	ErrNotFound                              = errors.New("not found")
	ErrUnsupportedType                       = errors.New("unsupported type")
	ErrUserAlreadyVerifiedEmail              = errors.New("user already verified email")
)
