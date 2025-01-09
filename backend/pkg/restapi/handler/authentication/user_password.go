package authentication

import (
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// ChangeUserPassword godoc
// @Description Change currently authenticated user's password
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/change-user-password [post]
// @Security BasicAuthentication
// @Success 200 {object} responder.DetailResponse
// @Summary Change password
// @Tags authentication
func (h *Handler) ChangeUserPassword(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	params := poeticmetric.ChangeUserPasswordParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.authenticationService.ChangeUserPassword(r.Context(), authentication.User.ID, &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.Detail(w, "User's password is updated.")
}
