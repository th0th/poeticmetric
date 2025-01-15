package users

import (
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// List godoc
// @Description List users.
// @Router /users [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationUser
// @Summary List users
// @Tags users
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	organizationUsers, err := h.userService.ListOrganizationUsers(r.Context(), auth.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.Json(w, organizationUsers)
}
