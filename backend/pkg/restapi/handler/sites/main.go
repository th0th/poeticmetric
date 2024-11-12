package sites

import (
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
		h.responder.Error(w, err)
		return
	}

	h.responder.Json(w, organizationSites)
}
