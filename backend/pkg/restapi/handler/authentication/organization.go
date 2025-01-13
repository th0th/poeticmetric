package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
)

// ReadOrganization godoc
// @Description Read currently authenticated user's organization
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

	h.responder.Json(w, user)
}

// UpdateOrganization godoc
// @Description Update currently authenticated user's organization
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

	h.responder.Json(w, organization)
}
