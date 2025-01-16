package users

import (
	"encoding/json"
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// Invite godoc
// @Description Invite a new user to organization.
// @Param params body poeticmetric.InviteOrganizationUserParams true "Params"
// @Router /users [post]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationUser
// @Summary Invite user
// @Tags users
func (h *Handler) Invite(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	params := poeticmetric.InviteOrganizationUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	organizationUser, err := h.userService.InviteOrganizationUser(r.Context(), auth.User.OrganizationID, &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.responder.Json(w, organizationUser)
}

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
