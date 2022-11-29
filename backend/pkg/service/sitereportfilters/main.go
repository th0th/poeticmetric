package sitereportfilters

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"gorm.io/gorm"
	"time"
)

type Filters struct {
	BrowserName            *string   `query:"browserName"`
	BrowserVersion         *string   `query:"browserVersion"`
	CountryIsoCode         *string   `query:"countryIsoCode"`
	DeviceType             *string   `query:"deviceType"`
	End                    time.Time `query:"end"`
	Language               *string   `query:"language"`
	Locale                 *string   `query:"locale"`
	OperatingSystemName    *string   `query:"operatingSystemName"`
	OperatingSystemVersion *string   `query:"operatingSystemVersion"`
	Page                   *string   `query:"page"`
	ReferrerSite           *string   `query:"referrerSite"`
	SiteId                 uint64    `query:"siteId"`
	Start                  time.Time `query:"start"`
	TimeZone               *string   `query:"timeZone"`
	UtmCampaign            *string   `query:"utmCampaign"`
	UtmContent             *string   `query:"utmContent"`
	UtmMedium              *string   `query:"utmMedium"`
	UtmSource              *string   `query:"utmSource"`
	UtmTerm                *string   `query:"utmTerm"`
}

func Apply(dp *depot.Depot, filters *Filters) *gorm.DB {
	clickHouseSession := dp.ClickHouse().
		Model(&model.Event{}).
		Where("site_id = ?", filters.SiteId).
		Where("date_time < ?", filters.End).
		Where("date_time >= ?", filters.Start)

	if filters.BrowserName != nil {
		clickHouseSession.Where("browser_name = ?", *filters.BrowserName)
	}

	if filters.BrowserVersion != nil {
		clickHouseSession.Where("browser_version = ?", *filters.BrowserVersion)
	}

	if filters.CountryIsoCode != nil {
		clickHouseSession.Where("country_iso_code = ?", *filters.CountryIsoCode)
	}

	if filters.DeviceType != nil {
		clickHouseSession.Where("device_type = ?", *filters.DeviceType)
	}

	if filters.Language != nil {
		clickHouseSession.Where("language = ?", *filters.Language)
	}

	if filters.Locale != nil {
		clickHouseSession.Where("locale = ?", *filters.Locale)
	}

	if filters.OperatingSystemName != nil {
		clickHouseSession.Where("operating_system_name = ?", *filters.OperatingSystemName)
	}

	if filters.OperatingSystemVersion != nil {
		clickHouseSession.Where("operating_system_version = ?", *filters.OperatingSystemVersion)
	}

	if filters.Page != nil {
		clickHouseSession.Where("page = ?", *filters.Page)
	}

	if filters.ReferrerSite != nil {
		clickHouseSession.
			Where("domain(referrer) != domain(url)").
			Where("concat(protocol(referrer), '://', domain(referrer)) = ?", *filters.ReferrerSite)
	}

	return clickHouseSession
}

func (f *Filters) GetTimeZone() string {
	if f.TimeZone != nil {
		return *f.TimeZone
	}

	return "UTC"
}
