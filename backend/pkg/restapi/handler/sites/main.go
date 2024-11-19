package sites

import (
	"encoding/json"
	"net/http"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/restapi/middleware"
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
// @Param params body poeticmetric.CreateSiteParams true "Params"
// @Router /sites [post]
// @Security UserAccessTokenAuthentication
// @Success 201 {object} poeticmetric.OrganizationSite
// @Summary Create site
// @Tags sites
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	auth := middleware.GetAuthentication(r.Context())

	params := poeticmetric.CreateSiteParams{}
	err := json.NewDecoder(r.Body).Decode(&params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	organizationSite, err := h.siteService.Create(r.Context(), auth.User.OrganizationID, &params)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	w.WriteHeader(http.StatusCreated)
	h.responder.Json(w, organizationSite)
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

	organizationSites, err := h.siteService.List(r.Context(), auth.User.OrganizationID)
	if err != nil {
		h.responder.Error(w, err)
		return
	}

	h.responder.Json(w, organizationSites)
}
