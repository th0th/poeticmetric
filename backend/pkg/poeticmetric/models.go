package poeticmetric

import (
	"crypto/sha256"
	"fmt"
	"net/url"
	"time"

	"github.com/dchest/uniuri"
	"github.com/go-errors/errors"
	"github.com/mileusna/useragent"
	"golang.org/x/crypto/bcrypt"
)

const (
	EventDeviceTypeDesktop EventDeviceType = "DESKTOP"
	EventDeviceTypeMobile  EventDeviceType = "MOBILE"
	EventDeviceTypeTablet  EventDeviceType = "TABLET"
)

const (
	EventKindPageView EventKind = "PAGE_VIEW"
)

const (
	OrganizationNameMaxLength           = 70
	OrganizationNameMinLength           = 2
	OrganizationSubscriptionPeriodMonth = "MONTH"
	OrganizationSubscriptionPeriodYear  = "YEAR"
)

const (
	SiteNameMaxLength = 50
	SiteNameMinLength = 1
)

const (
	UserNameMaxLength     = 70
	UserNameMinLength     = 1
	UserPasswordMaxLength = 72
	UserPasswordMinLength = 8
)

type Event struct {
	BrowserName            *string
	BrowserVersion         *string
	CountryISOCode         *string
	DateTime               time.Time
	DeviceType             *EventDeviceType
	DurationSeconds        uint32
	ID                     string
	IsBot                  bool
	Kind                   EventKind
	Language               *string
	Locale                 *string
	OperatingSystemName    *string
	OperatingSystemVersion *string
	Referrer               *string
	SiteID                 uint
	TimeZone               *string
	URL                    string
	UserAgent              string
	UTMCampaign            *string
	UTMContent             *string
	UTMMedium              *string
	UTMSource              *string
	UTMTerm                *string
	VisitorID              string
}

type EventDeviceType = string

type EventKind = string

type Organization struct {
	CreatedAt               time.Time
	GoogleOauthRefreshToken *string
	ID                      uint
	IsOnTrial               bool
	Name                    string
	Plan                    *Plan
	PlanID                  uint
	StripeCustomerID        *string
	SubscriptionPeriod      *string
	TimeZone                string
	TrialEndsAt             *time.Time
	UpdatedAt               time.Time
}

type OrganizationDeletion struct {
	DateTime                     time.Time
	Detail                       *string
	ID                           uint
	OrganizationCreatedAt        time.Time
	OrganizationID               uint
	OrganizationName             string
	OrganizationPlanName         string
	OrganizationStripeCustomerID *string
	Reason                       string
	UserEmail                    string
	UserID                       uint
	UserName                     string
}

type Plan struct {
	CreatedAt         time.Time `gorm:"not null"`
	ID                uint      `gorm:"primaryKey"`
	MaxEventsPerMonth int
	MaxUsers          int
	Name              string
	StripeProductID   *string
	UpdatedAt         time.Time `gorm:"not null"`
}

type Site struct {
	CreatedAt                  time.Time
	Domain                     string
	GoogleSearchConsoleSiteUrl *string
	HasEvents                  bool
	ID                         uint
	IsPublic                   bool
	Name                       string
	Organization               Organization `gorm:"constraint:OnDelete:CASCADE"`
	OrganizationID             uint
	SafeQueryParameters        []string `gorm:"serializer:json"`
	UpdatedAt                  time.Time
}

type User struct {
	ActivationToken          *string
	CreatedAt                time.Time
	Email                    string
	EmailVerificationToken   *string
	ID                       uint
	IsActive                 bool
	IsEmailVerified          bool
	IsOrganizationOwner      bool
	LastAccessTokenCreatedAt *time.Time
	Name                     string
	Organization             Organization
	OrganizationID           uint
	Password                 string
	PasswordResetToken       *string
	UpdatedAt                time.Time
}

type UserAccessToken struct {
	CreatedAt  time.Time
	ID         uint
	LastUsedAt *time.Time
	Token      string
	User       User
	UserID     uint
}

func EventKinds() []EventKind {
	return []EventKind{
		EventKindPageView,
	}
}

func (e *Event) Fill(ipAddress string, organizationSalt string, safeQueryParameters []string) error {
	parsedURL, err := url.Parse(e.URL)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	// visitor ID
	checksum := sha256.Sum256([]byte(organizationSalt + ipAddress + e.UserAgent))
	e.VisitorID = fmt.Sprintf("%x", checksum)

	// user agent
	userAgent := useragent.Parse(e.UserAgent)

	e.IsBot = userAgent.Bot

	if userAgent.Name != "" {
		e.BrowserName = &userAgent.Name
	}

	if userAgent.OS != "" {
		e.OperatingSystemName = &userAgent.OS
	}

	if userAgent.OSVersion != "" {
		e.OperatingSystemVersion = &userAgent.OSVersion
	}

	if userAgent.Version != "" {
		e.BrowserVersion = &userAgent.Version
	}

	if userAgent.Desktop {
		e.DeviceType = Pointer(EventDeviceTypeDesktop)
	} else if userAgent.Mobile {
		e.DeviceType = Pointer(EventDeviceTypeMobile)
	} else if userAgent.Tablet {
		e.DeviceType = Pointer(EventDeviceTypeTablet)
	}

	// locale
	if e.Locale != nil {
		language := LocaleLanguageMap()[*e.Locale]
		if language != "" {
			e.Language = &language
		}
	}

	// time zone
	if e.TimeZone != nil {
		countryISOCode := TimeZoneCountryISOCodeMap()[*e.TimeZone]
		if countryISOCode != "" {
			e.CountryISOCode = &countryISOCode
		}
	}

	// utm
	utmCampaign := parsedURL.Query().Get("utm_campaign")
	if utmCampaign != "" {
		e.UTMCampaign = &utmCampaign
	}

	utmContent := parsedURL.Query().Get("utm_content")
	if utmContent != "" {
		e.UTMContent = &utmContent
	}

	utmMedium := parsedURL.Query().Get("utm_medium")
	if utmMedium != "" {
		e.UTMMedium = &utmMedium
	}

	utmSource := parsedURL.Query().Get("utm_source")
	if utmSource != "" {
		e.UTMSource = &utmSource
	}

	utmTerm := parsedURL.Query().Get("utm_term")
	if utmTerm != "" {
		e.UTMTerm = &utmTerm
	}

	// safe query parameters
	safeQueryParametersMap := map[string]bool{}
	for _, queryParameter := range safeQueryParameters {
		safeQueryParametersMap[queryParameter] = true
	}

	query := parsedURL.Query()
	for k := range query {
		if !safeQueryParametersMap[k] {
			query.Del(k)
		}
	}

	parsedURL.RawQuery = query.Encode()
	e.URL = parsedURL.String()

	return nil
}

func (e *Event) TableName() string {
	return "events_buffer"
}

func (u *User) SetActivationToken() {
	u.ActivationToken = Pointer(uniuri.New())
}

func (u *User) SetPassword(password string) error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		return err
	}

	u.Password = string(bytes)

	return nil
}

func (u *User) SetPasswordResetToken() {
	u.PasswordResetToken = Pointer(uniuri.New())
}

func (u *UserAccessToken) SetToken() {
	u.Token = uniuri.New()
}
