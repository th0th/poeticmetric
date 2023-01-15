package model

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"github.com/mileusna/useragent"
	"github.com/poeticmetric/poeticmetric/backend/pkg/country"
	locale2 "github.com/poeticmetric/poeticmetric/backend/pkg/locale"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"log"
	url2 "net/url"
	"time"
)

type Event struct {
	BrowserName            *string
	BrowserVersion         *string
	CountryIsoCode         *string
	DateTime               time.Time
	DeviceType             *string
	Duration               uint32
	Id                     string
	IsBot                  bool
	IsBounce               bool
	Kind                   string
	Language               *string
	Locale                 *string
	OperatingSystemName    *string
	OperatingSystemVersion *string
	Path                   string
	Referrer               *string
	SiteId                 uint64
	TimeZone               *string
	Url                    string
	UserAgent              string
	UtmCampaign            *string
	UtmContent             *string
	UtmMedium              *string
	UtmSource              *string
	UtmTerm                *string
	VisitorId              string
}

type EventKind = string

const (
	EventDeviceTypeDesktop = "DESKTOP"
	EventDeviceTypeMobile  = "MOBILE"
	EventDeviceTypeTablet  = "TABLET"
)

const (
	EventKindPageView EventKind = "PAGE_VIEW"
)

const (
	EventUserAgentMaxLength = 2000
	EventUserAgentMinLength = 2
)

func (e *Event) TableName() string {
	return "events_buffer"
}

func (e *Event) FillFromLocale(locale string) {
	e.Locale = &locale

	e.Language = locale2.GetLanguage(locale)
}

func (e *Event) FillFromTimeZone(timeZone string) {
	e.TimeZone = &timeZone

	e.CountryIsoCode = country.GetIsoCodeFromTimeZoneName(*e.TimeZone)
}

func (e *Event) FillFromUrl(url string, safeQueryParameters []string) {
	u, err := url2.Parse(url)
	if err != nil {
		// TODO: handle error
	}

	e.UtmCampaign = pointer.StringOrNil(u.Query().Get("utm_campaign"))
	e.UtmContent = pointer.StringOrNil(u.Query().Get("utm_content"))
	e.UtmMedium = pointer.StringOrNil(u.Query().Get("utm_medium"))
	e.UtmSource = pointer.StringOrNil(u.Query().Get("utm_source"))
	e.UtmTerm = pointer.StringOrNil(u.Query().Get("utm_term"))

	safeQueryParametersMap := map[string]bool{}

	for _, queryParameter := range safeQueryParameters {
		safeQueryParametersMap[queryParameter] = true
	}

	q := u.Query()

	for k := range u.Query() {
		log.Println(safeQueryParametersMap[k])
		if !safeQueryParametersMap[k] {
			q.Del(k)
		}
	}

	u.RawQuery = q.Encode()
	e.Url = u.String()

	e.Path = u.Path
}

func (e *Event) FillFromUserAgent(userAgent string) {
	e.UserAgent = userAgent

	ua := useragent.Parse(userAgent)

	e.IsBot = ua.Bot

	if ua.Name != "" {
		e.BrowserName = &ua.Name
	}

	if ua.Version != "" {
		e.BrowserVersion = &ua.Version
	}

	if ua.OS != "" {
		e.OperatingSystemName = &ua.OS
	}

	if ua.OSVersion != "" {
		e.OperatingSystemVersion = &ua.OSVersion
	}

	if ua.Desktop {
		e.DeviceType = pointer.Get(EventDeviceTypeDesktop)
	} else if ua.Mobile {
		e.DeviceType = pointer.Get(EventDeviceTypeMobile)
	} else if ua.Tablet {
		e.DeviceType = pointer.Get(EventDeviceTypeTablet)
	}
}

func (e *Event) FillVisitorId(ipAddress string, userAgent string) {
	h := sha256.Sum256([]byte(fmt.Sprintf("%s%s", ipAddress, userAgent)))

	e.VisitorId = hex.EncodeToString(h[:])
}
