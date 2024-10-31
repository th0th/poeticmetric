package middleware

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type PermissionParams struct {
	AuthenticationKind  *AuthenticationKind
	IsAuthenticated     *bool
	IsEmailVerified     *bool
	IsOrganizationOwner *bool
}

func PermissionHandler(responder poeticmetric.RestApiResponder, params PermissionParams) func(handler http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authentication := GetAuthentication(r.Context())

			// IsAuthenticated
			if params.IsAuthenticated != nil {
				if *params.IsAuthenticated && authentication.User == nil {
					responder.Unauthorized(w)
					return
				}

				if !*params.IsAuthenticated && authentication.User != nil {
					responder.Forbidden(w)
					return
				}
			}

			// AuthKind
			if params.AuthenticationKind != nil {
				if *authentication.Kind != *params.AuthenticationKind {
					responder.Forbidden(w)
					return
				}
			}

			// IsEmailVerified
			if params.IsEmailVerified != nil {
				if authentication.User == nil || authentication.User.IsEmailVerified != *params.IsEmailVerified {
					w.WriteHeader(http.StatusForbidden)
					responder.Detail(w, "Please verify your e-mail address.")
					return
				}
			}

			// IsOrganizationOwner
			if params.IsOrganizationOwner != nil {
				if authentication.User == nil || !authentication.User.IsOrganizationOwner {
					responder.Forbidden(w)
					return
				}
			}

			handler.ServeHTTP(w, r)
		})
	}
}

func PermissionAuthenticated(responder poeticmetric.RestApiResponder) func(handler http.Handler) http.Handler {
	return PermissionHandler(responder, PermissionParams{
		IsAuthenticated: poeticmetric.Pointer(true),
	})
}

func PermissionUserAccessTokenAuthenticated(responder poeticmetric.RestApiResponder) func(handler http.Handler) http.Handler {
	return PermissionHandler(responder, PermissionParams{
		AuthenticationKind: poeticmetric.Pointer(AuthenticationKindAccessToken),
		IsAuthenticated:    poeticmetric.Pointer(true),
	})
}

func PermissionBasicAuthenticated(responder poeticmetric.RestApiResponder) func(handler http.Handler) http.Handler {
	return PermissionHandler(responder, PermissionParams{
		AuthenticationKind: poeticmetric.Pointer(AuthenticationKindBasic),
		IsAuthenticated:    poeticmetric.Pointer(true),
	})
}

func PermissionAuthenticatedEmailVerified(responder poeticmetric.RestApiResponder) func(handler http.Handler) http.Handler {
	return PermissionHandler(responder, PermissionParams{
		IsAuthenticated: poeticmetric.Pointer(true),
		IsEmailVerified: poeticmetric.Pointer(true),
	})
}

func PermissionOrganizationOwner(responder poeticmetric.RestApiResponder) func(handler http.Handler) http.Handler {
	return PermissionHandler(responder, PermissionParams{
		IsAuthenticated:     poeticmetric.Pointer(true),
		IsOrganizationOwner: poeticmetric.Pointer(true),
	})
}
