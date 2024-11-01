package middleware

import (
	"context"
	"encoding/base64"
	"errors"
	"net/http"
	"strings"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

const authenticationContextKey authenticationContextKeyType = "authentication"

const (
	AuthenticationKindAccessToken AuthenticationKind = "ACCESS_TOKEN"
	AuthenticationKindBasic       AuthenticationKind = "BASIC"
)

type AuthenticationKind string

type authenticationContextKeyType string

type Authentication struct {
	Kind            AuthenticationKind
	User            *poeticmetric.User
	UserAccessToken *poeticmetric.UserAccessToken
}

func AuthenticationHandler(
	authenticationService poeticmetric.AuthenticationService,
	responder poeticmetric.RestApiResponder,
) func(handler http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authorizationHeader := r.Header.Get("Authorization")

			var authentication *Authentication
			var err error

			// basic authentication
			if strings.HasPrefix(strings.ToLower(authorizationHeader), "basic ") {
				authentication, err = basicAuthentication(authenticationService, r)
				if err != nil {
					if errors.Is(err, errAuthenticationFailed) {
						responder.Unauthorized(w)
						return
					}

					responder.Error(w, err)
					return
				}
			} else if strings.HasPrefix(strings.ToLower(authorizationHeader), "bearer ") {
				authentication, err = userAccessTokenAuthentication(authenticationService, r)
				if err != nil {
					if errors.Is(err, errAuthenticationFailed) {
						responder.Unauthorized(w)
						return
					}

					responder.Error(w, err)
					return
				}
			}

			if authentication == nil {
				r = r.WithContext(SetAuthentication(r.Context(), authentication))
			}

			handler.ServeHTTP(w, r)
		})
	}
}

func GetAuthentication(ctx context.Context) *Authentication {
	authentication, ok := ctx.Value(authenticationContextKey).(*Authentication)
	if !ok {
		return nil
	}

	return authentication
}

func SetAuthentication(ctx context.Context, authentication *Authentication) context.Context {
	return context.WithValue(ctx, authenticationContextKey, authentication)
}

func basicAuthentication(authenticationService poeticmetric.AuthenticationService, r *http.Request) (*Authentication, error) {
	authorizationHeader := r.Header.Get("Authorization")
	credentialsByte, err := base64.StdEncoding.DecodeString(authorizationHeader[6:])
	if err != nil {
		return nil, errAuthenticationFailed
	}

	credentials := strings.SplitN(string(credentialsByte), ":", 2)
	if len(credentials) != 2 {
		return nil, errAuthenticationFailed
	}

	user, err := authenticationService.ReadUserByEmailPassword(r.Context(), credentials[0], credentials[1])
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			return nil, errAuthenticationFailed
		}

		return nil, err
	}

	authentication := Authentication{
		Kind: AuthenticationKindBasic,
		User: user,
	}

	return &authentication, nil
}

func userAccessTokenAuthentication(authenticationService poeticmetric.AuthenticationService, r *http.Request) (*Authentication, error) {
	authorizationHeader := r.Header.Get("Authorization")
	token := authorizationHeader[7:]

	user, userAccessToken, err := authenticationService.ReadUserByUserAccessToken(r.Context(), token)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			return nil, errAuthenticationFailed
		}

		return nil, err
	}

	authentication := Authentication{
		Kind:            AuthenticationKindAccessToken,
		User:            user,
		UserAccessToken: userAccessToken,
	}

	return &authentication, nil
}

var (
	errAuthenticationFailed = errors.New("authentication failed")
)
