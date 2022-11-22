package model

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"github.com/mileusna/useragent"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"net/url"
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
	Kind                   string
	Language               *string
	Locale                 *string
	OperatingSystemName    *string
	OperatingSystemVersion *string
	Page                   string
	Referrer               *string
	ReferrerDomain         *string
	SiteId                 uint64
	TimeZone               *string
	Url                    string
	UserAgent              *string
	UtmCampaign            *string
	UtmContent             *string
	UtmMedium              *string
	UtmSource              *string
	UtmTerm                *string
	VisitorId              string
}

const (
	EventDeviceTypeDesktop = "DESKTOP"
	EventDeviceTypeMobile  = "MOBILE"
	EventDeviceTypeTablet  = "TABLET"
)

const (
	EventKindPageView = "PAGE_VIEW"
)

func (event *Event) TableName() string {
	return "events_buffer"
}

func (event *Event) FillVisitorId(ipAddress string, userAgent string) {
	h := sha256.Sum256([]byte(fmt.Sprintf("%s%s", ipAddress, userAgent)))

	event.VisitorId = hex.EncodeToString(h[:])
}

func (event *Event) FillFromUrl(urlString string) {
	event.Url = urlString

	u, err := url.Parse(urlString)
	if err != nil {
		// TODO: handle error
	}

	event.Page = u.Path
}

func (event *Event) FillFromUserAgent(userAgent string) {
	event.UserAgent = &userAgent

	ua := useragent.Parse(userAgent)

	event.BrowserName = &ua.Name
	event.BrowserVersion = &ua.Version
	event.IsBot = ua.Bot

	if ua.OS != "" {
		event.OperatingSystemName = &ua.OS
	}

	if ua.OSVersion != "" {
		event.OperatingSystemVersion = &ua.OSVersion
	}

	if ua.Desktop {
		event.DeviceType = pointer.Get(EventDeviceTypeDesktop)
	} else if ua.Mobile {
		event.DeviceType = pointer.Get(EventDeviceTypeMobile)
	} else if ua.Tablet {
		event.DeviceType = pointer.Get(EventDeviceTypeTablet)
	}
}
