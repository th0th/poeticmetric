package poeticmetric

import (
	"context"
	"time"
)

type SiteService interface {
	ServiceWithPostgres

	CreateOrganizationSite(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) (*OrganizationSite, error)
	DeleteOrganizationSite(ctx context.Context, organizationID uint, siteID uint) error
	ListOrganizationSites(ctx context.Context, organizationID uint) ([]*OrganizationSite, error)
	ReadOrganizationSite(ctx context.Context, organizationID uint, siteID uint) (*OrganizationSite, error)
	ReadSiteOverviewReport(ctx context.Context, filters *SiteReportFilters) (*SiteOverviewReport, error)
	ReadSiteVisitorReport(ctx context.Context, filters *SiteReportFilters) (*SiteVisitorReport, error)
	UpdateOrganizationSite(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error
}

type CreateOrganizationSiteParams struct {
	Domain                     *string  `json:"domain"`
	GoogleSearchConsoleSiteURL *string  `json:"googleSearchConsoleSiteURL"`
	IsPublic                   *bool    `json:"isPublic"`
	Name                       *string  `json:"name"`
	SafeQueryParameters        []string `gorm:"serializer:json" json:"safeQueryParameters"`
}

type OrganizationSite struct {
	CreatedAt                  time.Time `json:"createdAt"`
	Domain                     string    `json:"domain"`
	GoogleSearchConsoleSiteUrl *string   `json:"googleSearchConsoleSiteURL"`
	HasEvents                  bool      `json:"hasEvents"`
	ID                         uint      `json:"id"`
	IsPublic                   bool      `json:"isPublic"`
	Name                       string    `json:"name"`
	SafeQueryParameters        []string  `gorm:"serializer:json" json:"safeQueryParameters"`
	UpdatedAt                  time.Time `json:"updatedAt"`
}

type SiteOverviewReport struct {
	AveragePageViewDurationSeconds                 *uint64  `json:"averagePageViewDurationSeconds"`
	AveragePageViewDurationSecondsPercentageChange *int16   `json:"averagePageViewDurationSecondsPercentageChange"`
	PageViewCount                                  uint64   `json:"pageViewCount"`
	PageViewCountPerVisitor                        *float64 `json:"pageViewCountPerVisitor"`
	PageViewCountPerVisitorPercentageChange        *int16   `json:"pageViewCountPerVisitorPercentageChange"`
	PageViewCountPercentageChange                  int16    `json:"pageViewCountPercentageChange"`
	VisitorCount                                   uint64   `json:"visitorCount"`
	VisitorCountPercentageChange                   int16    `json:"visitorCountPercentageChange"`
}

type SiteReportFilters struct {
	BrowserName            *string   `schema:"browserName"`
	BrowserVersion         *string   `schema:"browserVersion"`
	CountryISOCode         *string   `schema:"countryISOCode"`
	DeviceType             *string   `schema:"deviceType"`
	End                    time.Time `schema:"end"`
	Language               *string   `schema:"language"`
	Locale                 *string   `schema:"locale"`
	OperatingSystemName    *string   `schema:"operatingSystemName"`
	OperatingSystemVersion *string   `schema:"operatingSystemVersion"`
	Path                   *string   `schema:"path"`
	Referrer               *string   `schema:"referrer"`
	ReferrerSite           *string   `schema:"referrerSite"`
	SiteID                 uint64    `schema:"siteID"`
	Start                  time.Time `schema:"start"`
	TimeZone               *string   `schema:"timeZone"`
	UtmCampaign            *string   `schema:"utmCampaign"`
	UtmContent             *string   `schema:"utmContent"`
	UtmMedium              *string   `schema:"utmMedium"`
	UtmSource              *string   `schema:"utmSource"`
	UtmTerm                *string   `schema:"utmTerm"`
}

type SiteVisitorReport struct {
	AverageVisitorCount uint64                   `json:"averageVisitorCount"`
	Data                []SiteVisitorReportDatum `json:"data"`
	IntervalSeconds     uint64                   `json:"intervalSeconds"`
}

type SiteVisitorReportDatum struct {
	DateTime     time.Time `json:"dateTime"`
	VisitorCount *uint64   `json:"visitorCount"`
}

type UpdateOrganizationSiteParams struct {
	Domain                     *string  `json:"domain"`
	GoogleSearchConsoleSiteURL *string  `json:"googleSearchConsoleSiteURL"`
	IsPublic                   *bool    `json:"isPublic"`
	Name                       *string  `json:"name"`
	SafeQueryParameters        []string `gorm:"serializer:json" json:"safeQueryParameters"`
}

func (s *OrganizationSite) TableName() string {
	return "sites"
}

func (f *SiteReportFilters) IntervalSeconds() uint64 {
	diff := f.End.Sub(f.Start)
	if diff > 360 * 24 * time.Hour {
		return uint64(7 * 24 * time.Hour.Seconds())
	}
	if diff > 7 * 24 * time.Hour {
		return uint64(24 * time.Hour.Seconds())
	}

	return uint64(time.Hour.Seconds())
}

func (f *SiteReportFilters) Map() map[string]any {
	return map[string]any{
		"browserName":            f.BrowserName,
		"browserVersion":         f.BrowserVersion,
		"countryISOCode":         f.CountryISOCode,
		"deviceType":             f.DeviceType,
		"end":                    f.End,
		"language":               f.Language,
		"locale":                 f.Locale,
		"operatingSystemName":    f.OperatingSystemName,
		"operatingSystemVersion": f.OperatingSystemVersion,
		"path":                   f.Path,
		"referrer":               f.Referrer,
		"referrerSite":           f.ReferrerSite,
		"siteID":                 f.SiteID,
		"start":                  f.Start,
		"timeZone":               f.TimeZone,
		"utmCampaign":            f.UtmCampaign,
		"utmContent":             f.UtmContent,
		"utmMedium":              f.UtmMedium,
		"utmSource":              f.UtmSource,
		"utmTerm":                f.UtmTerm,
	}
}
