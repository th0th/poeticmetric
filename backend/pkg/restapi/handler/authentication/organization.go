package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

type GetOrganizationDeletionOptionsResponse struct {
	DetailMaxLength int                                        `json:"detailMaxLength"`
	DetailMinLength int                                        `json:"detailMinLength"`
	Reasons         []*poeticmetric.OrganizationDeletionReason `json:"reasons"`
}

// DeleteOrganization godoc
// @Description Delete organization and all associated data irreversibly.
// @Param params body poeticmetric.OrganizationDeletionParams true "Params"
// @Router /authentication/organization [delete]
// @Security BasicAuthentication
// @Success 204
// @Summary Delete organization
// @Tags authentication
func (h *Handler) DeleteOrganization(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	params := poeticmetric.OrganizationDeletionParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	err = h.authenticationService.DeleteOrganization(r.Context(), auth.User.OrganizationID, &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// GetOrganizationDeletionOptions godoc
// @Description List possible organization deletion reasons.
// @Router /authentication/organization-deletion-reasons [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationDeletionReason
// @Summary List organization deletion reasons
// @Tags authentication
func (h *Handler) GetOrganizationDeletionOptions(w http.ResponseWriter, r *http.Request) {
	organizationDeletionReasons, err := h.authenticationService.ListOrganizationDeletionReasons(r.Context())
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	response := GetOrganizationDeletionOptionsResponse{
		DetailMaxLength: poeticmetric.OrganizationDeletionDetailMaxLength,
		DetailMinLength: poeticmetric.OrganizationDeletionDetailMinLength,
		Reasons:         organizationDeletionReasons,
	}

	h.responder.JSON(w, response)
}

// ReadOrganization godoc
// @Description Read currently authenticated user's organization.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/organization [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationOrganization
// @Summary Read organization
// @Tags authentication
func (h *Handler) ReadOrganization(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	user, err := h.authenticationService.ReadOrganization(r.Context(), authentication.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, user)
}

// UpdateOrganization godoc
// @Description Update currently authenticated user's organization.
// @Failure 400 {object} responder.DetailResponse
// @Router /authentication/organization [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.AuthenticationOrganization
// @Summary Update organization
// @Tags authentication
func (h *Handler) UpdateOrganization(w http.ResponseWriter, r *http.Request) {
	authentication := middleware.GetAuthentication(r.Context())

	params := poeticmetric.UpdateOrganizationParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	organization := &poeticmetric.AuthenticationOrganization{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.authenticationService, func(ctx context.Context) error {
		err = h.authenticationService.UpdateOrganization(ctx, authentication.User.OrganizationID, &params)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		organization, err = h.authenticationService.ReadOrganization(ctx, authentication.User.OrganizationID)
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, organization)
}
