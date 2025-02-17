package sitereports

import (
	"net/http"

	"github.com/go-errors/errors"

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

// ReadSiteOverviewReport godoc
// @Description Read overview report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Router /site-reports/overview [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SiteOverviewReport
// @Summary Read overview report
// @Tags site-reports
func (h *Handler) ReadSiteOverviewReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)
	organizationSite, err := h.siteService.ReadSiteOverviewReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSite)
}

// ReadSiteVisitorReport godoc
// @Description Read visitor report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Router /site-reports/visitor [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SiteVisitorReport
// @Summary Read visitor report
// @Tags site-reports
func (h *Handler) ReadSiteVisitorReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)
	organizationSite, err := h.siteService.ReadSiteVisitorReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSite)
}
