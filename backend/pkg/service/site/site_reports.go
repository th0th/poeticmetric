package site

import (
	"context"
	_ "embed"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) getFilteredClickHouse(ctx context.Context, f *poeticmetric.SiteReportFilters) *gorm.DB {
	ch := s.clickHouse.
		Model(&poeticmetric.Event{}).
		Where("site_id = ?", f.SiteID).
		Where("date_time < ?", f.End).
		Where("date_time >= ?", f.Start)

	if f.BrowserName != nil {
		ch.Where("browser_name = ?", *f.BrowserName)
	}

	if f.BrowserVersion != nil {
		ch.Where("browser_version = ?", *f.BrowserVersion)
	}

	if f.CountryISOCode != nil {
		ch.Where("country_iso_code = ?", *f.CountryISOCode)
	}

	if f.DeviceType != nil {
		ch.Where("device_type = ?", *f.DeviceType)
	}

	if f.Language != nil {
		ch.Where("language = ?", *f.Language)
	}

	if f.Locale != nil {
		ch.Where("locale = ?", *f.Locale)
	}

	if f.OperatingSystemName != nil {
		ch.Where("operating_system_name = ?", *f.OperatingSystemName)
	}

	if f.OperatingSystemVersion != nil {
		ch.Where("operating_system_version = ?", *f.OperatingSystemVersion)
	}

	if f.Path != nil {
		ch.Where("pathFull(url) = ?", *f.Path)
	}

	if f.Referrer != nil {
		ch.
			Where("referrer = ?", *f.Referrer)
	}

	if f.ReferrerSite != nil {
		ch.
			Where("domain(referrer) != domain(url)").
			Where("concat(protocol(referrer), '://', domain(referrer)) = ?", *f.ReferrerSite)
	}

	if f.UtmCampaign != nil {
		ch.Where("utm_campaign = ?", *f.UtmCampaign)
	}

	if f.UtmContent != nil {
		ch.Where("utm_content = ?", *f.UtmContent)
	}

	if f.UtmMedium != nil {
		ch.Where("utm_medium = ?", *f.UtmMedium)
	}

	if f.UtmSource != nil {
		ch.Where("utm_source = ?", *f.UtmSource)
	}

	if f.UtmTerm != nil {
		ch.Where("utm_term = ?", *f.UtmTerm)
	}

	return ch
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

func (s *service) ReadSiteVisitorReport(ctx context.Context, filters *poeticmetric.SiteReportFilters) (*poeticmetric.SiteVisitorReport, error) {
	siteVisitorReport := poeticmetric.SiteVisitorReport{
		IntervalSeconds: filters.IntervalSeconds(),
	}

	err := s.clickHouse.Raw(siteVisitorReportDataQuery, filters.Map()).Scan(&siteVisitorReport.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	err = s.clickHouse.Raw(siteVisitorReportAverageVisitorCountQuery, filters.Map()).Scan(&siteVisitorReport.AverageVisitorCount).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &siteVisitorReport, nil
}

//go:embed files/site_overview_report.sql
var siteOverviewReportQuery string

//go:embed files/site_visitor_report_average_visitor_count.sql
var siteVisitorReportAverageVisitorCountQuery string

//go:embed files/site_visitor_report_data.sql
var siteVisitorReportDataQuery string
