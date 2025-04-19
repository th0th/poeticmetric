package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// ActivateUser godoc
// @Description Activate user with the activation token.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/activate-user [post]
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Activate user
// @Tags authentication
func (h *Handler) ActivateUser(w http.ResponseWriter, r *http.Request) {
	params := poeticmetric.ActivateUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.authenticationService.ActivateUser(r.Context(), &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.Detail(w, http.StatusOK, "User activated successfully.")
}

// ReadUser godoc
// @Description Read currently authenticated user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Read user
// @Tags authentication
func (h *Handler) ReadUser(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	user, err := h.authenticationService.ReadUser(r.Context(), authentication.User.ID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}

// UpdateUser godoc
// @Description Update currently authenticated user.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/user [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationUser
// @Summary Update user
// @Tags authentication
func (h *Handler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	params := poeticmetric.UpdateAuthenticationUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	user := &poeticmetric.AuthenticationUser{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.authenticationService, func(ctx context.Context) error {
		err = h.authenticationService.UpdateUser(ctx, authentication.User.ID, &params)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		user, err = h.authenticationService.ReadUser(ctx, authentication.User.ID)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, user)
}
