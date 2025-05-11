package sites

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
	responder   poeticmetric.RestApiResponder
	siteService poeticmetric.SiteService
}

type NewParams struct {
	Responder   poeticmetric.RestApiResponder
	SiteService poeticmetric.SiteService
}

func New(params NewParams) *Handler {
	return &Handler{
		responder:   params.Responder,
		siteService: params.SiteService,
	}
}

// Create godoc
// @Description Create site.
// @Param params body poeticmetric.CreateOrganizationSiteParams true "Params"
// @Router /sites [post]
// @Security UserAccessTokenAuthentication
// @Success 201 {object} poeticmetric.OrganizationSite
// @Summary Create site
// @Tags sites
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	params := poeticmetric.CreateOrganizationSiteParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	organizationSite, err := h.siteService.CreateOrganizationSite(r.Context(), auth.User.OrganizationID, &params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusCreated, organizationSite)
}

// Delete godoc
// @Description Delete an organization site.
// @Param siteID path int true "Site ID"
// @Router /sites/{siteID} [delete]
// @Security UserAccessTokenAuthentication
// @Success 204
// @Summary Delete site
// @Tags sites
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	siteID, err := parser.PathValue[uint](r, "siteID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	err = h.siteService.DeleteOrganizationSite(r.Context(), auth.User.OrganizationID, siteID)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// List godoc
// @Description List sites.
// @Router /sites [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationSite
// @Summary List sites
// @Tags sites
func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	organizationSites, err := h.siteService.ListOrganizationSites(r.Context(), auth.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSites)
}

// Read godoc
// @Description Read an organization site.
// @Param siteID path int true "Site ID"
// @Router /sites/{siteID} [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationSite
// @Summary Read site
// @Tags sites
func (h *Handler) Read(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	siteID, err := parser.PathValue[uint](r, "siteID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	organizationSite, err := h.siteService.ReadOrganizationSite(r.Context(), auth.User.OrganizationID, siteID)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSite)
}

// Update godoc
// @Description Update organization site.
// @Param siteID path int true "Site ID"
// @Param params body poeticmetric.UpdateOrganizationSiteParams true "Params"
// @Router /sites/{siteID} [patch]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationSite
// @Summary Update site
// @Tags sites
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	siteID, err := parser.PathValue[uint](r, "siteID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	params := poeticmetric.UpdateOrganizationSiteParams{}
	err = json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	organizationSite := poeticmetric.OrganizationSite{}
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.siteService, func(ctx context.Context) error {
		err2 := h.siteService.UpdateOrganizationSite(r.Context(), auth.User.OrganizationID, siteID, &params)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		tempOrganizationSite, err2 := h.siteService.ReadOrganizationSite(r.Context(), auth.User.OrganizationID, siteID)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}
		organizationSite = *tempOrganizationSite

		return nil
	})


	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSite)
}
