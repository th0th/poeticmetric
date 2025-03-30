package site

import (
	"context"
	_ "embed"

	"github.com/go-errors/errors"
	"golang.org/x/sync/errgroup"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) ReadSiteBrowserNameReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteBrowserNameReportPaginationCursor],
) (*poeticmetric.SiteBrowserNameReport, error) {
	report := poeticmetric.SiteBrowserNameReport{
		Data: []poeticmetric.SiteBrowserNameReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationBrowserName"] = paginationCursor.Data.BrowserName
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationBrowserName"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteBrowserNameReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteBrowserNameReportPaginationCursor]{
			Data: poeticmetric.SiteBrowserNameReportPaginationCursor{
				BrowserName:  datum.BrowserName,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteBrowserVersionReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteBrowserVersionReportPaginationCursor],
) (*poeticmetric.SiteBrowserVersionReport, error) {
	report := poeticmetric.SiteBrowserVersionReport{
		Data: []poeticmetric.SiteBrowserVersionReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationBrowserVersion"] = paginationCursor.Data.BrowserVersion
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationBrowserVersion"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteBrowserVersionReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteBrowserVersionReportPaginationCursor]{
			Data: poeticmetric.SiteBrowserVersionReportPaginationCursor{
				BrowserVersion: datum.BrowserVersion,
				VisitorCount:   datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteCountryReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteCountryReportPaginationCursor],
) (*poeticmetric.SiteCountryReport, error) {
	report := poeticmetric.SiteCountryReport{
		Data: []poeticmetric.SiteCountryReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationCountryISOCode"] = paginationCursor.Data.CountryISOCode
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationCountryISOCode"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteCountryReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	countryISOCodeNameMap := poeticmetric.CountryISOCodeNameMap()

	for i := range report.Data {
		report.Data[i].Country = countryISOCodeNameMap[report.Data[i].CountryISOCode]
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteCountryReportPaginationCursor]{
			Data: poeticmetric.SiteCountryReportPaginationCursor{
				CountryISOCode: datum.CountryISOCode,
				VisitorCount:   datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteDeviceTypeReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
) (*poeticmetric.SiteDeviceTypeReport, error) {
	siteDeviceTypeReport := poeticmetric.SiteDeviceTypeReport{}

	err := s.clickHouse.Raw(siteDeviceTypeReportQuery, filters.Map()).Scan(&siteDeviceTypeReport).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &siteDeviceTypeReport, nil
}

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

func (s *service) ReadSiteOperatingSystemNameReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteOperatingSystemNameReportPaginationCursor],
) (*poeticmetric.SiteOperatingSystemNameReport, error) {
	report := poeticmetric.SiteOperatingSystemNameReport{
		Data: []poeticmetric.SiteOperatingSystemNameReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationOperatingSystemName"] = paginationCursor.Data.OperatingSystemName
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationOperatingSystemName"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteOperatingSystemNameReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteOperatingSystemNameReportPaginationCursor]{
			Data: poeticmetric.SiteOperatingSystemNameReportPaginationCursor{
				OperatingSystemName: datum.OperatingSystemName,
				VisitorCount:        datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteOperatingSystemVersionReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteOperatingSystemVersionReportPaginationCursor],
) (*poeticmetric.SiteOperatingSystemVersionReport, error) {
	report := poeticmetric.SiteOperatingSystemVersionReport{
		Data: []poeticmetric.SiteOperatingSystemVersionReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationOperatingSystemVersion"] = paginationCursor.Data.OperatingSystemVersion
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationOperatingSystemVersion"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteOperatingSystemVersionReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteOperatingSystemVersionReportPaginationCursor]{
			Data: poeticmetric.SiteOperatingSystemVersionReportPaginationCursor{
				OperatingSystemVersion: datum.OperatingSystemVersion,
				VisitorCount:           datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteOverviewReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
) (*poeticmetric.SiteOverviewReport, error) {
	report := poeticmetric.SiteOverviewReport{}

	err := s.clickHouse.Raw(siteOverviewReportQuery, filters.Map()).Scan(&report).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &report, nil
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

func (s *service) ReadSiteTimeOfWeekTrendsReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
) (*poeticmetric.SiteTimeOfWeekTrendsReport, error) {
	report := poeticmetric.SiteTimeOfWeekTrendsReport{}

	err := s.clickHouse.Raw(siteTimeOfWeekTrendsReportQuery, filters.Map()).Scan(&report).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &report, nil
}

func (s *service) ReadSiteUTMCampaignReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMCampaignReportPaginationCursor],
) (*poeticmetric.SiteUTMCampaignReport, error) {
	report := poeticmetric.SiteUTMCampaignReport{
		Data: []poeticmetric.SiteUTMCampaignReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationUTMCampaign"] = paginationCursor.Data.UTMCampaign
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationUTMCampaign"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteUTMCampaignReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMCampaignReportPaginationCursor]{
			Data: poeticmetric.SiteUTMCampaignReportPaginationCursor{
				UTMCampaign:  datum.UTMCampaign,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteUTMContentReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMContentReportPaginationCursor],
) (*poeticmetric.SiteUTMContentReport, error) {
	report := poeticmetric.SiteUTMContentReport{
		Data: []poeticmetric.SiteUTMContentReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationUTMContent"] = paginationCursor.Data.UTMContent
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationUTMContent"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteUTMCampaignReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMContentReportPaginationCursor]{
			Data: poeticmetric.SiteUTMContentReportPaginationCursor{
				UTMContent:   datum.UTMContent,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteUTMMediumReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMMediumReportPaginationCursor],
) (*poeticmetric.SiteUTMMediumReport, error) {
	report := poeticmetric.SiteUTMMediumReport{
		Data: []poeticmetric.SiteUTMMediumReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationUTMMedium"] = paginationCursor.Data.UTMMedium
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationUTMMedium"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteUTMMediumReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMMediumReportPaginationCursor]{
			Data: poeticmetric.SiteUTMMediumReportPaginationCursor{
				UTMMedium:    datum.UTMMedium,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteUTMSourceReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMSourceReportPaginationCursor],
) (*poeticmetric.SiteUTMSourceReport, error) {
	report := poeticmetric.SiteUTMSourceReport{
		Data: []poeticmetric.SiteUTMSourceReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationUTMSource"] = paginationCursor.Data.UTMSource
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationUTMSource"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteUTMSourceReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMSourceReportPaginationCursor]{
			Data: poeticmetric.SiteUTMSourceReportPaginationCursor{
				UTMSource:    datum.UTMSource,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteUTMTermReport(
	ctx context.Context,
	filters *poeticmetric.SiteReportFilters,
	paginationCursor *poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMTermReportPaginationCursor],
) (*poeticmetric.SiteUTMTermReport, error) {
	report := poeticmetric.SiteUTMTermReport{
		Data: []poeticmetric.SiteUTMTermReportDatum{},
	}

	queryValues := map[string]any{
		"limit": poeticmetric.SiteReportPageSize,
	}
	for k, v := range filters.Map() {
		queryValues[k] = v
	}
	if paginationCursor != nil {
		queryValues["paginationUTMTerm"] = paginationCursor.Data.UTMTerm
		queryValues["paginationVisitorCount"] = paginationCursor.Data.VisitorCount
	} else {
		queryValues["paginationUTMTerm"] = nil
		queryValues["paginationVisitorCount"] = nil
	}

	err := s.clickHouse.Raw(siteUTMTermReportQuery, queryValues).Scan(&report.Data).Error
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	if len(report.Data) >= poeticmetric.SiteReportPageSize {
		datum := report.Data[len(report.Data)-1]

		report.PaginationCursor = &poeticmetric.SiteReportPaginationCursor[poeticmetric.SiteUTMTermReportPaginationCursor]{
			Data: poeticmetric.SiteUTMTermReportPaginationCursor{
				UTMTerm:      datum.UTMTerm,
				VisitorCount: datum.VisitorCount,
			},
		}
	}

	return &report, nil
}

func (s *service) ReadSiteVisitorReport(ctx context.Context, filters *poeticmetric.SiteReportFilters) (*poeticmetric.SiteVisitorReport, error) {
	report := poeticmetric.SiteVisitorReport{
		IntervalSeconds: filters.IntervalSeconds(),
	}

	errGroup := errgroup.Group{}

	errGroup.Go(func() error {
		err := s.clickHouse.Raw(siteVisitorReportDataQuery, filters.Map()).Scan(&report.Data).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	errGroup.Go(func() error {
		err := s.clickHouse.Raw(siteVisitorReportAverageVisitorCountQuery, filters.Map()).Scan(&report.AverageVisitorCount).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}

		return nil
	})

	err := errGroup.Wait()
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &report, nil
}

//go:embed files/site_browser_name_report.sql
var siteBrowserNameReportQuery string

//go:embed files/site_browser_version_report.sql
var siteBrowserVersionReportQuery string

//go:embed files/site_country_report.sql
var siteCountryReportQuery string

//go:embed files/site_device_type_report.sql
var siteDeviceTypeReportQuery string

//go:embed files/site_language_report.sql
var siteLanguageReportQuery string

//go:embed files/site_operating_system_name_report.sql
var siteOperatingSystemNameReportQuery string

//go:embed files/site_operating_system_version_report.sql
var siteOperatingSystemVersionReportQuery string

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

//go:embed files/site_time_of_week_trends_report.sql
var siteTimeOfWeekTrendsReportQuery string

//go:embed files/site_utm_campaign_report.sql
var siteUTMCampaignReportQuery string

//go:embed files/site_utm_medium_report.sql
var siteUTMMediumReportQuery string

//go:embed files/site_utm_source_report.sql
var siteUTMSourceReportQuery string

//go:embed files/site_utm_term_report.sql
var siteUTMTermReportQuery string

//go:embed files/site_visitor_report_average_visitor_count.sql
var siteVisitorReportAverageVisitorCountQuery string

//go:embed files/site_visitor_report_data.sql
var siteVisitorReportDataQuery string
