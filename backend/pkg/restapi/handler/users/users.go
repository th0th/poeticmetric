package users

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/parser"
)

type Handler struct {
	userService poeticmetric.UserService
	responder   poeticmetric.RestApiResponder
}

type NewParams struct {
	UserService poeticmetric.UserService
	Responder   poeticmetric.RestApiResponder
}

func New(params NewParams) *Handler {
	return &Handler{
		userService: params.UserService,
		responder:   params.Responder,
	}
}

// Delete godoc
// @Description Delete a user from the organization.
// @Param userID path int true "User ID"
// @Router /users/{userID} [delete]
// @Security UserAccessTokenAuthentication
// @Success 204
// @Summary Delete user
// @Tags users
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	userID, err := parser.PathValue[uint](r, "userID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	err = h.userService.DeleteOrganizationUser(r.Context(), auth.User.OrganizationID, userID)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

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
	h.responder.JSON(w, organizationUser)
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

	h.responder.JSON(w, organizationUsers)
}

// Read godoc
// @Description Read a user from the organization.
// @Param userID path int true "User ID"
// @Router /users/{userID} [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationUser
// @Summary Read user
// @Tags users
func (h *Handler) Read(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	userID, err := parser.PathValue[uint](r, "userID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	organizationUser, err := h.userService.ReadOrganizationUser(r.Context(), auth.User.OrganizationID, userID)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.JSON(w, organizationUser)
}

// Update godoc
// @Description Update organization user.
// @Param userID path int true "User ID"
// @Param params body poeticmetric.UpdateOrganizationUserParams true "Params"
// @Router /users/{userID} [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationUser
// @Summary Update user
// @Tags users
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	params := poeticmetric.UpdateOrganizationUserParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	userID, err := parser.PathValue[uint](r, "userID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	var organizationUser poeticmetric.OrganizationUser
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.userService, func(ctx context.Context) error {
		err2 := h.userService.UpdateOrganizationUser(r.Context(), auth.User.OrganizationID, userID, &params)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		tempOrganizationUser, err2 := h.userService.ReadOrganizationUser(r.Context(), auth.User.OrganizationID, userID)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		organizationUser = *tempOrganizationUser

		return nil
	})
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.JSON(w, organizationUser)
}
