package authentication

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

type Handler struct {
	authenticationService poeticmetric.AuthenticationService
	responder             poeticmetric.RestApiResponder
}

type NewParams struct {
	AuthenticationService poeticmetric.AuthenticationService
	Responder             poeticmetric.RestApiResponder
}

func New(params NewParams) *Handler {
	return &Handler{
		authenticationService: params.AuthenticationService,
		responder:             params.Responder,
	}
}

// CreateUserAccessToken godoc
// @Description Create a user access token by authenticating with the e-mail address and password.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user-access-tokens [post]
// @Security BasicAuthentication
// @Success 201 {object} poeticmetric.AuthenticationServiceUserAccessToken
// @Summary Create user access token
// @Tags authentication
func (h *Handler) CreateUserAccessToken(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	userAccessToken, err := h.authenticationService.CreateUserAccessToken(r.Context(), authentication.User.ID)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.responder.Json(w, userAccessToken)
}

// DeleteUserAccessToken godoc
// @Description Delete user access token currently in use.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user-access-tokens [delete]
// @Security UserAccessTokenAuthentication
// @Success 204
// @Summary Create user access token
// @Tags authentication
func (h *Handler) DeleteUserAccessToken(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	err := h.authenticationService.DeleteUserAccessToken(r.Context(), authentication.UserAccessToken.ID)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
