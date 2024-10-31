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
	Kind            *AuthenticationKind
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

			// basic authentication
			if strings.HasPrefix(strings.ToLower(authorizationHeader), "basic ") {
				basicAuthentication(authenticationService, responder, w, r)
			} else if strings.HasPrefix(strings.ToLower(authorizationHeader), "bearer ") {
				userAccessTokenAuthentication(authenticationService, responder, w, r)
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

func basicAuthentication(
	authenticationService poeticmetric.AuthenticationService,
	responder poeticmetric.RestApiResponder,
	w http.ResponseWriter,
	r *http.Request,
) {
	authorizationHeader := r.Header.Get("Authorization")
	credentialsByte, err := base64.StdEncoding.DecodeString(authorizationHeader[6:])
	if err != nil {
		responder.Unauthorized(w)
		return
	}

	credentials := strings.SplitN(string(credentialsByte), ":", 2)
	if len(credentials) != 2 {
		responder.Unauthorized(w)
		return
	}

	user, err := authenticationService.ReadUserByEmailPassword(r.Context(), credentials[0], credentials[1])
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			responder.Unauthorized(w)
			return
		}

		responder.Error(w, err)
	}

	authentication := Authentication{
		Kind: poeticmetric.Pointer(AuthenticationKindBasic),
		User: user,
	}

	r2 := r.WithContext(SetAuthentication(r.Context(), &authentication))
	*r = *r2
}

func userAccessTokenAuthentication(
	authenticationService poeticmetric.AuthenticationService,
	responder poeticmetric.RestApiResponder,
	w http.ResponseWriter,
	r *http.Request,
) {
	authorizationHeader := r.Header.Get("Authorization")
	token := authorizationHeader[7:]

	user, userAccessToken, err := authenticationService.ReadUserByUserAccessToken(r.Context(), token)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			responder.Unauthorized(w)
			return
		}

		responder.Error(w, err)
		return
	}

	authentication := Authentication{
		Kind:            poeticmetric.Pointer(AuthenticationKindAccessToken),
		User:            user,
		UserAccessToken: userAccessToken,
	}

	*r = *(r.WithContext(SetAuthentication(r.Context(), &authentication)))
}
