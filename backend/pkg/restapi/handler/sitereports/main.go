package sitereports

import (
	"encoding/base64"
	"encoding/json"
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

// ReadSitePageViewReport godoc
// @Description Read page view report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Router /site-reports/page-view [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SitePageViewReport
// @Summary Read page view report
// @Tags site-reports
func (h *Handler) ReadSitePageViewReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)
	organizationSite, err := h.siteService.ReadSitePageViewReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, organizationSite)
}

// ReadSitePathReport godoc
// @Description Read path report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Param cursor query string false "Pagination cursor"
// @Router /site-reports/path [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SitePathReport
// @Summary Read path report
// @Tags site-reports
func (h *Handler) ReadSitePathReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)

	paginationCursor, err := getPaginationCursor[poeticmetric.SitePathReportPaginationCursor](r)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	organizationSite, err := h.siteService.ReadSitePathReport(r.Context(), filters, paginationCursor)
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

func getPaginationCursor[T any](r *http.Request) (*poeticmetric.SiteReportPaginationCursor[T], error) {
	cursorString := r.URL.Query().Get("cursor")
	if cursorString == "" {
		return nil, nil
	}

	cursorBytes, err := base64.StdEncoding.DecodeString(cursorString)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	cursor := poeticmetric.SiteReportPaginationCursor[T]{}
	err = json.Unmarshal(cursorBytes, &cursor.Data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &cursor, nil
}
