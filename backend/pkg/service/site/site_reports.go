package site

import (
	"context"
	_ "embed"

	"github.com/go-errors/errors"
	"golang.org/x/sync/errgroup"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

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

func (s *service) ReadSitePageViewReport(ctx context.Context, filters *poeticmetric.SiteReportFilters) (*poeticmetric.SitePageViewReport, error) {
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

//go:embed files/site_overview_report.sql
var siteOverviewReportQuery string

//go:embed files/site_page_view_report_average_page_view_count.sql
var sitePageViewReportAveragePageViewCountQuery string

//go:embed files/site_page_view_report_data.sql
var sitePageViewReportDataQuery string

//go:embed files/site_visitor_report_average_visitor_count.sql
var siteVisitorReportAverageVisitorCountQuery string

//go:embed files/site_visitor_report_data.sql
var siteVisitorReportDataQuery string
