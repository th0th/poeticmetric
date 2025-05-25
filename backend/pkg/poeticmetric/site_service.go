package poeticmetric

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"time"

	"github.com/go-errors/errors"
	"gorm.io/gorm"
)

const SiteReportPageSize = 100

type SiteService interface {
	ServiceWithPostgres
	CreateOrganizationSite(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) (*OrganizationSite, error)
	DeleteOrganizationSite(ctx context.Context, organizationID uint, siteID uint) error
	ListGoogleSearchConsoleSites(ctx context.Context, organizationID uint, siteID uint) ([]*GoogleSearchConsoleSite, error)
	ListOrganizationSites(ctx context.Context, organizationID uint) ([]*OrganizationSite, error)
	ReadOrganizationSite(ctx context.Context, organizationID uint, siteID uint) (*OrganizationSite, error)
	ReadSiteBrowserNameReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteBrowserNameReportPaginationCursor]) (*SiteBrowserNameReport, error)
	ReadSiteBrowserVersionReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteBrowserVersionReportPaginationCursor]) (*SiteBrowserVersionReport, error)
	ReadSiteCountryReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteCountryReportPaginationCursor]) (*SiteCountryReport, error)
	ReadSiteDeviceTypeReport(ctx context.Context, filters *SiteReportFilters) (*SiteDeviceTypeReport, error)
	ReadSiteGoogleSearchTermsReport(ctx context.Context, filters *SiteReportFilters, page *int) (SiteGoogleSearchTermsReport, error)
	ReadSiteLanguageReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteLanguageReportPaginationCursor]) (*SiteLanguageReport, error)
	ReadSiteOperatingSystemNameReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteOperatingSystemNameReportPaginationCursor]) (*SiteOperatingSystemNameReport, error)
	ReadSiteOperatingSystemVersionReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteOperatingSystemVersionReportPaginationCursor]) (*SiteOperatingSystemVersionReport, error)
	ReadSiteOverviewReport(ctx context.Context, filters *SiteReportFilters) (*SiteOverviewReport, error)
	ReadSitePageViewReport(ctx context.Context, filters *SiteReportFilters) (*SitePageViewReport, error)
	ReadSitePathReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SitePathReportPaginationCursor]) (*SitePathReport, error)
	ReadSiteReferrerHostReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteReferrerHostReportPaginationCursor]) (*SiteReferrerHostReport, error)
	ReadSiteReferrerReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteReferrerReportPaginationCursor]) (*SiteReferrerReport, error)
	ReadSiteTimeOfWeekTrendsReport(ctx context.Context, filters *SiteReportFilters) (*SiteTimeOfWeekTrendsReport, error)
	ReadSiteUTMCampaignReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteUTMCampaignReportPaginationCursor]) (*SiteUTMCampaignReport, error)
	ReadSiteUTMContentReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteUTMContentReportPaginationCursor]) (*SiteUTMContentReport, error)
	ReadSiteUTMMediumReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteUTMMediumReportPaginationCursor]) (*SiteUTMMediumReport, error)
	ReadSiteUTMSourceReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteUTMSourceReportPaginationCursor]) (*SiteUTMSourceReport, error)
	ReadSiteUTMTermReport(ctx context.Context, filters *SiteReportFilters, paginationCursor *SiteReportPaginationCursor[SiteUTMTermReportPaginationCursor]) (*SiteUTMTermReport, error)
	ReadSiteVisitorReport(ctx context.Context, filters *SiteReportFilters) (*SiteVisitorReport, error)
	SetSiteGoogleOAuthRefreshToken(ctx context.Context, organizationID uint, siteID uint, params *SetSiteGoogleOAuthRefreshTokenParams) error
	UpdateOrganizationSite(ctx context.Context, organizationID uint, siteID uint, params *UpdateOrganizationSiteParams) error
}

type CreateOrganizationSiteParams struct {
	Domain              *string  `json:"domain"`
	IsPublic            *bool    `json:"isPublic"`
	Name                *string  `json:"name"`
	SafeQueryParameters []string `gorm:"serializer:json" json:"safeQueryParameters"`
}

type GoogleSearchConsoleSite struct {
	SiteURL string `json:"siteURL"`
}

type OrganizationSite struct {
	CreatedAt                  time.Time `json:"createdAt"`
	Domain                     string    `json:"domain"`
	GoogleOauthRefreshToken    *string   `json:"-"`
	GoogleSearchConsoleSiteUrl *string   `json:"googleSearchConsoleSiteURL"`
	HasEvents                  bool      `json:"hasEvents"`
	HasGoogleOauth             bool      `gorm:"-" json:"hasGoogleOauth"`
	ID                         uint      `json:"id"`
	IsPublic                   bool      `json:"isPublic"`
	Name                       string    `json:"name"`
	SafeQueryParameters        []string  `gorm:"serializer:json" json:"safeQueryParameters"`
	UpdatedAt                  time.Time `json:"updatedAt"`
}

type SetSiteGoogleOAuthRefreshTokenParams struct {
	AuthCode *string `json:"authCode"`
}

type SiteBrowserNameReport struct {
	Data             []SiteBrowserNameReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteBrowserNameReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteBrowserNameReportDatum struct {
	BrowserName       string  `json:"browserName"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteBrowserNameReportPaginationCursor struct {
	BrowserName  string
	VisitorCount uint64
}

type SiteBrowserVersionReport struct {
	Data             []SiteBrowserVersionReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteBrowserVersionReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteBrowserVersionReportDatum struct {
	BrowserVersion    string  `json:"browserVersion"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteBrowserVersionReportPaginationCursor struct {
	BrowserVersion string
	VisitorCount   uint64
}

type SiteCountryReport struct {
	Data             []SiteCountryReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteCountryReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteCountryReportDatum struct {
	Country           string  `json:"country"`
	CountryISOCode    string  `json:"countryISOCode"`
	VisitorCount      uint    `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteCountryReportPaginationCursor struct {
	CountryISOCode string
	VisitorCount   uint
}

type SiteDeviceTypeReport []SiteDeviceTypeReportDatum

type SiteDeviceTypeReportDatum struct {
	DeviceType        string  `json:"deviceType"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteGoogleSearchTermsReport []*SiteGoogleSearchTermsReportDatum

type SiteGoogleSearchTermsReportDatum struct {
	Clicks      float64 `json:"clicks"`
	Ctr         float64 `json:"ctr"`
	Impressions float64 `json:"impressions"`
	Position    float64 `json:"position"`
	Query       string  `json:"query"`
}

type SiteLanguageReport struct {
	Data             []SiteLanguageReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteLanguageReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteLanguageReportDatum struct {
	Language          string  `json:"language"`
	VisitorCount      uint    `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteLanguageReportPaginationCursor struct {
	Language     string
	VisitorCount uint
}

type SiteOperatingSystemNameReport struct {
	Data             []SiteOperatingSystemNameReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteOperatingSystemNameReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteOperatingSystemNameReportDatum struct {
	OperatingSystemName string  `json:"operatingSystemName"`
	VisitorCount        uint64  `json:"visitorCount"`
	VisitorPercentage   float64 `json:"visitorPercentage"`
}

type SiteOperatingSystemNameReportPaginationCursor struct {
	OperatingSystemName string
	VisitorCount        uint64
}

type SiteOperatingSystemVersionReport struct {
	Data             []SiteOperatingSystemVersionReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteOperatingSystemVersionReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteOperatingSystemVersionReportDatum struct {
	OperatingSystemVersion string  `json:"operatingSystemVersion"`
	VisitorCount           uint64  `json:"visitorCount"`
	VisitorPercentage      float64 `json:"visitorPercentage"`
}

type SiteOperatingSystemVersionReportPaginationCursor struct {
	OperatingSystemVersion string
	VisitorCount           uint64
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

type SitePathReport struct {
	Data             []SitePathReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SitePathReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SitePathReportDatum struct {
	AverageDurationSeconds uint32  `json:"averageDurationSeconds"`
	BouncePercentage       float64 `json:"bouncePercentage"`
	Path                   string  `json:"path"`
	URL                    string  `json:"url"`
	ViewCount              uint64  `json:"viewCount"`
	ViewPercentage         float64 `json:"viewPercentage"`
	VisitorCount           uint64  `json:"visitorCount"`
	VisitorPercentage      float64 `json:"visitorPercentage"`
}

type SitePathReportPaginationCursor struct {
	Path         string
	VisitorCount uint64
}

type SitePageViewReport struct {
	AveragePageViewCount *float64                  `json:"averagePageViewCount"`
	Data                 []SitePageViewReportDatum `json:"data"`
	IntervalSeconds      uint64                    `json:"intervalSeconds"`
}

type SitePageViewReportDatum struct {
	DateTime      time.Time `json:"dateTime"`
	PageViewCount *uint64   `json:"pageViewCount"`
}

type SiteReferrerHostReport struct {
	Data             []SiteReferrerHostReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteReferrerHostReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteReferrerHostReportDatum struct {
	ReferrerHost      string  `json:"referrerHost"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteReferrerHostReportPaginationCursor struct {
	Host         string
	VisitorCount uint64
}

type SiteReferrerReport struct {
	Data             []SiteReferrerReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteReferrerReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteReferrerReportDatum struct {
	Referrer          string  `json:"referrer"`
	ReferrerHost      string  `json:"referrerHost"`
	ReferrerPath      string  `json:"referrerPath"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteReferrerReportPaginationCursor struct {
	Referrer     string
	VisitorCount uint64
}

type SiteReportFilters struct {
	BrowserName            *string   `schema:"browserName"`
	BrowserVersion         *string   `schema:"browserVersion"`
	CountryISOCode         *string   `schema:"countryISOCode"`
	DeviceType             *string   `schema:"deviceType"`
	End                    time.Time `default:"2026-01-01T00:00:00Z" schema:"end"`
	Language               *string   `schema:"language"`
	Locale                 *string   `schema:"locale"`
	OperatingSystemName    *string   `schema:"operatingSystemName"`
	OperatingSystemVersion *string   `schema:"operatingSystemVersion"`
	Path                   *string   `schema:"path"`
	Referrer               *string   `schema:"referrer"`
	ReferrerHost           *string   `schema:"referrerHost"`
	SiteID                 uint      `schema:"siteID"`
	Start                  time.Time `default:"2025-01-01T00:00:00Z" schema:"start"`
	TimeZone               *string   `default:"UTC" schema:"timeZone"`
	UtmCampaign            *string   `schema:"utmCampaign"`
	UtmContent             *string   `schema:"utmContent"`
	UtmMedium              *string   `schema:"utmMedium"`
	UtmSource              *string   `schema:"utmSource"`
	UtmTerm                *string   `schema:"utmTerm"`
}

type SiteReportPaginationCursor[T any] struct {
	Data T
}

type SiteTimeOfWeekTrendsReport []SiteTimeOfWeekTrendReportDatum

type SiteTimeOfWeekTrendReportDatum struct {
	DayOfWeek      int     `json:"dayOfWeek"`
	HourOfDay      int     `json:"hourOfDay"`
	ViewCount      uint    `json:"viewCount"`
	ViewPercentage float64 `json:"viewPercentage"`
}

type SiteUTMCampaignReport struct {
	Data             []SiteUTMCampaignReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteUTMCampaignReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteUTMCampaignReportDatum struct {
	UTMCampaign       string  `json:"utmCampaign"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteUTMCampaignReportPaginationCursor struct {
	UTMCampaign  string
	VisitorCount uint64
}

type SiteUTMContentReport struct {
	Data             []SiteUTMContentReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteUTMContentReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteUTMContentReportDatum struct {
	UTMContent        string  `json:"utmContent"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteUTMContentReportPaginationCursor struct {
	UTMContent   string
	VisitorCount uint64
}

type SiteUTMMediumReport struct {
	Data             []SiteUTMMediumReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteUTMMediumReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteUTMMediumReportDatum struct {
	UTMMedium         string  `json:"utmMedium"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteUTMMediumReportPaginationCursor struct {
	UTMMedium    string
	VisitorCount uint64
}

type SiteUTMSourceReport struct {
	Data             []SiteUTMSourceReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteUTMSourceReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteUTMSourceReportDatum struct {
	UTMSource         string  `json:"utmSource"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteUTMSourceReportPaginationCursor struct {
	UTMSource    string
	VisitorCount uint64
}

type SiteUTMTermReport struct {
	Data             []SiteUTMTermReportDatum                                       `json:"data"`
	PaginationCursor *SiteReportPaginationCursor[SiteUTMTermReportPaginationCursor] `json:"paginationCursor" swaggertype:"string"`
}

type SiteUTMTermReportDatum struct {
	UTMTerm           string  `json:"utmTerm"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type SiteUTMTermReportPaginationCursor struct {
	UTMTerm      string
	VisitorCount uint64
}

type SiteVisitorReport struct {
	AverageVisitorCount *float64                 `json:"averageVisitorCount"`
	Data                []SiteVisitorReportDatum `json:"data"`
	IntervalSeconds     uint64                   `json:"intervalSeconds"`
}

type SiteVisitorReportDatum struct {
	DateTime     time.Time `json:"dateTime"`
	VisitorCount *uint64   `json:"visitorCount"`
}

type UpdateOrganizationSiteParams struct {
	Domain                     *string          `json:"domain"`
	GoogleSearchConsoleSiteURL Optional[string] `json:"googleSearchConsoleSiteURL"`
	IsPublic                   *bool            `json:"isPublic"`
	Name                       *string          `json:"name"`
	SafeQueryParameters        []string         `gorm:"serializer:json" json:"safeQueryParameters"`
}

func (s *OrganizationSite) AfterFind(_ *gorm.DB) error {
	s.HasGoogleOauth = s.GoogleOauthRefreshToken != nil

	return nil
}

func (s *OrganizationSite) TableName() string {
	return "sites"
}

func (f *SiteReportFilters) IntervalSeconds() uint64 {
	diff := f.End.Sub(f.Start)
	if diff > 360*24*time.Hour {
		return uint64(7 * 24 * time.Hour.Seconds())
	}
	if diff > 7*24*time.Hour {
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
		"referrerHost":           f.ReferrerHost,
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

func (c *SiteReportPaginationCursor[any]) MarshalJSON() ([]byte, error) {
	data, err := json.Marshal(c.Data)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	data, err = json.Marshal(base64.StdEncoding.EncodeToString(data))
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return data, nil
}
