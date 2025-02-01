package authentication

import (
	"encoding/json"
	"errors"
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
// @Success 201 {object} poeticmetric.AuthenticationUserAccessToken
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
	h.responder.JSON(w, userAccessToken)
}

// DeleteUserAccessToken godoc
// @Description Delete user access token currently in use.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user-access-tokens [delete]
// @Security UserAccessTokenAuthentication
// @Success 204
// @Summary Delete user access token
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

// ResetUserPassword godoc
// @Description Reset user's password also deleting all existing user access tokens for that user.
// @Failure 422 {object} poeticmetric.ResetUserPasswordParams
// @Param params body poeticmetric.ResetUserPasswordParams true "Params"
// @Router /authentication/reset-user-password [post]
// @Success 200 {object} responder.DetailResponse
// @Summary Reset user's password
// @Tags authentication
func (h *Handler) ResetUserPassword(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.ResetUserPasswordParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	err = h.authenticationService.ResetUserPassword(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.Detail(w, "Password is successfully reset.")
}

// SendUserPasswordRecoveryEmail godoc
// @Description Send a password recovery e-mail to the user.
// @Param params body poeticmetric.SendUserPasswordRecoveryEmailParams true "Params"
// @Router /authentication/send-user-password-recovery-email [post]
// @Success 201 {object} responder.DetailResponse
// @Summary Send user password recovery e-mail
// @Tags authentication
func (h *Handler) SendUserPasswordRecoveryEmail(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.SendUserPasswordRecoveryEmailParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	err = h.authenticationService.SendUserPasswordRecoveryEmail(r.Context(), &params)
	if err != nil {
		if !errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.Error(w, err)
			return
		}
	}

	w.WriteHeader(http.StatusAccepted)
	h.responder.Detail(
		w,
		"If the e-mail address exists in our database, you will receive a reset link. Check your inbox and follow the instructions.",
	)
}
