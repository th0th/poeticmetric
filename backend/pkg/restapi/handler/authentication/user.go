package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

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
