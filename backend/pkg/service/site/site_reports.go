package site

import (
	"context"
	_ "embed"

	"github.com/go-errors/errors"
	"golang.org/x/sync/errgroup"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ReadSiteLanguageReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteLanguageReportPaginationCursor],
) (*poeticmetric.SiteLanguageReport, error) {
	report := poeticmetric.SiteLanguageReport{
		Data: []poeticmetric.SiteLanguageReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationLanguage"] = paginationCursor.Data.Language
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationLanguage"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteLanguageReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteLanguageReportPaginationCursor]{
			Data: poeticmetric.SiteLanguageReportPaginationCursor{
				Language:     datum.Language,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteOverviewReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
) (*poeticmetric.SiteOverviewReport, error) {
	siteOverviewReport := poeticmetric.SiteOverviewReport{}

	err := s.clickHouse.Raw(siteOverviewReportQuery, filters.Map()).Scan(&siteOverviewReport).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &siteOverviewReport, nil
}

func (s *service) ReadSitePageViewReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
) (*poeticmetric.SitePageViewReport, error) {
	sitePageViewReport := poeticmetric.SitePageViewReport{
		IntervalSeconds: filters.IntervalSeconds(),
	}

	errGroup := errgroup.Group{}

	errGroup.Go(func() error {
		err := s.clickHouse.Raw(sitePageViewReportDataQuery, filters.Map()).Scan(&sitePageViewReport.Data).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	errGroup.Go(func() error {
		err := s.clickHouse.
			Raw(sitePageViewReportAveragePageViewCountQuery, filters.Map()).
			Scan(&sitePageViewReport.AveragePageViewCount).
			Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	err := errGroup.Wait()
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &sitePageViewReport, nil
}

func (s *service) ReadSitePathReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SitePathReportPaginationCursor],
) (*poeticmetric.SitePathReport, error) {
	report := poeticmetric.SitePathReport{
		Data: []poeticmetric.SitePathReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationPath"] = paginationCursor.Data.Path
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationPath"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(sitePathReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SitePathReportPaginationCursor]{
			Data: poeticmetric.SitePathReportPaginationCursor{
				Path:         datum.Path,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteReferrerHostReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteReferrerHostReportPaginationCursor],
) (*poeticmetric.SiteReferrerHostReport, error) {
	report := poeticmetric.SiteReferrerHostReport{
		Data: []poeticmetric.SiteReferrerHostReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationReferrerHost"] = paginationCursor.Data.Host
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationReferrerHost"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteReferrerHostReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteReferrerHostReportPaginationCursor]{
			Data: poeticmetric.SiteReferrerHostReportPaginationCursor{
				Host:         datum.ReferrerHost,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteReferrerReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteReferrerReportPaginationCursor],
) (*poeticmetric.SiteReferrerReport, error) {
	report := poeticmetric.SiteReferrerReport{
		Data: []poeticmetric.SiteReferrerReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationReferrer"] = paginationCursor.Data.Referrer
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationReferrer"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteReferrerReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteReferrerReportPaginationCursor]{
			Data: poeticmetric.SiteReferrerReportPaginationCursor{
				Referrer:     datum.Referrer,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteVisitorReport(ctx context.Context, filters *poeticmetric.SiteReportFilters) (*poeticmetric.SiteVisitorReport, error) {
	siteVisitorReport := poeticmetric.SiteVisitorReport{
		IntervalSeconds: filters.IntervalSeconds(),
	}

	errGroup := errgroup.Group{}

	errGroup.Go(func() error {
		err := s.clickHouse.Raw(siteVisitorReportDataQuery, filters.Map()).Scan(&siteVisitorReport.Data).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	errGroup.Go(func() error {
		err := s.clickHouse.Raw(siteVisitorReportAverageVisitorCountQuery, filters.Map()).Scan(&siteVisitorReport.AverageVisitorCount).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	err := errGroup.Wait()
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &siteVisitorReport, nil
}

//go:embed files/site_language_report.sql
var siteLanguageReportQuery string

//go:embed files/site_overview_report.sql
var siteOverviewReportQuery string

//go:embed files/site_page_view_report_average_page_view_count.sql
var sitePageViewReportAveragePageViewCountQuery string

//go:embed files/site_page_view_report_data.sql
var sitePageViewReportDataQuery string

//go:embed files/site_path_report.sql
var sitePathReportQuery string

//go:embed files/site_referrer_host_report.sql
var siteReferrerHostReportQuery string

//go:embed files/site_referrer_report.sql
var siteReferrerReportQuery string

//go:embed files/site_visitor_report_average_visitor_count.sql
var siteVisitorReportAverageVisitorCountQuery string

//go:embed files/site_visitor_report_data.sql
var siteVisitorReportDataQuery string
