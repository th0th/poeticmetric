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

// ReadSiteLanguageReport godoc
// @Description Read language report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Router /site-reports/language [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SiteLanguageReport
// @Summary Read language report
// @Tags site-reports
func (h *Handler) ReadSiteLanguageReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)

	paginationCursor, err := getPaginationCursor[poeticmetric.SiteLanguageReportPaginationCursor](r)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	report, err := h.siteService.ReadSiteLanguageReport(r.Context(), filters, paginationCursor)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
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
	report, err := h.siteService.ReadSiteOverviewReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
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
	report, err := h.siteService.ReadSitePageViewReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
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

	report, err := h.siteService.ReadSitePathReport(r.Context(), filters, paginationCursor)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
}

// ReadSiteReferrerReport godoc
// @Description Read referrer report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Param cursor query string false "Pagination cursor"
// @Router /site-reports/referrer [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SiteReferrerReport
// @Summary Read referrer report
// @Tags site-reports
func (h *Handler) ReadSiteReferrerReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)

	paginationCursor, err := getPaginationCursor[poeticmetric.SiteReferrerReportPaginationCursor](r)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	report, err := h.siteService.ReadSiteReferrerReport(r.Context(), filters, paginationCursor)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
}

// ReadSiteReferrerHostReport godoc
// @Description Read referrer host report for a site.
// @Param filters query poeticmetric.SiteReportFilters true "Filters"
// @Param cursor query string false "Pagination cursor"
// @Router /site-reports/referrer-host [get]
// @Security UserAccessTokenAuthentication
// @Success 200 {array} poeticmetric.SiteReferrerHostReport
// @Summary Read referrer host report
// @Tags site-reports
func (h *Handler) ReadSiteReferrerHostReport(w http.ResponseWriter, r *http.Request) {
	filters := middleware.GetSiteReportFilters(r)

	paginationCursor, err := getPaginationCursor[poeticmetric.SiteReferrerHostReportPaginationCursor](r)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	report, err := h.siteService.ReadSiteReferrerHostReport(r.Context(), filters, paginationCursor)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
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
	report, err := h.siteService.ReadSiteVisitorReport(r.Context(), filters)
	if err != nil {
		h.responder.Error(w, errors.Wrap(err, 0))
		return
	}

	h.responder.JSON(w, http.StatusOK, report)
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
