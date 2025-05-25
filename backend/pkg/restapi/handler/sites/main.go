package sites

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/gorilla/schema"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/parser"
)

type Handler struct {
	decoder     *schema.Decoder
	responder   poeticmetric.RestApiResponder
	siteService poeticmetric.SiteService
}

type NewParams struct {
	Decoder     *schema.Decoder
	Responder   poeticmetric.RestApiResponder
	SiteService poeticmetric.SiteService
}

func New(params NewParams) *Handler {
	return &Handler{
		decoder:     params.Decoder,
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

// ListGoogleSearchConsoleSites godoc
// @Description List Google Search Console sites for the site with Google OAuth refresh token.
// @Param siteID path int true "Site ID"
// @Router /sites/{siteID}/google-search-console-sites [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.OrganizationSite
// @Summary List Google Search Console sites
// @Tags sites
func (h *Handler) ListGoogleSearchConsoleSites(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	siteID, err := parser.PathValue[uint](r, "siteID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	googleSearchConsoleSites, err := h.siteService.ListGoogleSearchConsoleSites(r.Context(), auth.User.OrganizationID, siteID)
	if err != nil {
		if errors.Is(err, poeticmetric.ErrNotFound) {
			h.responder.NotFound(w)
			return
		}

		if errors.Is(err, poeticmetric.ErrGoogleOAuthTokenNotSet) {
			h.responder.Detail(w, http.StatusBadRequest, "You need to authenticate with Google first.")
			return
		}

		if errors.Is(err, poeticmetric.ErrGoogleOAuthTokenInvalid) {
			h.responder.Detail(w, http.StatusBadRequest, "Google authentication didn't work, please re-authenticate.")
			return
		}

		if errors.Is(err, poeticmetric.ErrGoogleOAuthConfigMissing) {
			h.responder.Detail(w, http.StatusBadRequest, "This feature is not available, because Google OAuth is not configured.")
			return
		}

		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, googleSearchConsoleSites)
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

// SetGoogleOAuthRefreshToken godoc
// @Description Set site's Google OAuth refresh token using oauth.
// @Param siteID path int true "Site ID"
// @Param params body poeticmetric.SetSiteGoogleOAuthRefreshTokenParams true "Params"
// @Router /sites/{siteID}/google-oauth [post]
// @Security UserAccessTokenAuthentication
// @Success 200 {object} poeticmetric.OrganizationSite
// @Summary Set site Google OAuth refresh token
// @Tags sites
func (h *Handler) SetGoogleOAuthRefreshToken(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	siteID, err := parser.PathValue[uint](r, "siteID")
	if err != nil {
		h.responder.NotFound(w)
		return
	}

	params := poeticmetric.SetSiteGoogleOAuthRefreshTokenParams{}
	err = json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	var organizationSite *poeticmetric.OrganizationSite
	err = poeticmetric.ServicePostgresTransaction(r.Context(), h.siteService, func(ctx context.Context) error {
		err2 := h.siteService.SetSiteGoogleOAuthRefreshToken(ctx, auth.User.OrganizationID, siteID, &params)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		organizationSite, err2 = h.siteService.ReadOrganizationSite(ctx, auth.User.OrganizationID, siteID)
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		if errors.Is(err, poeticmetric.ErrGoogleOAuthConfigMissing) {
			h.responder.Detail(w, http.StatusBadRequest, "This feature is not available, because Google OAuth is not configured.")
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
