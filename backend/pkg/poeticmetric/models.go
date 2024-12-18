package poeticmetric

import (
	url2 "net/url"
	"time"

	"github.com/dchest/uniuri"
	"github.com/mileusna/useragent"
	"golang.org/x/crypto/bcrypt"
)

const (
	EventDeviceTypeDesktop = "DESKTOP"
	EventDeviceTypeMobile  = "MOBILE"
	EventDeviceTypeTablet  = "TABLET"
	EventKindPageView      = "PAGE_VIEW"
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
	CountryIsoCode         *string
	DateTime               time.Time
	DeviceType             *string
	Duration               time.Duration
	ID                     string
	IsBot                  bool
	Kind                   string
	Language               *string
	Locale                 *string
	OperatingSystemName    *string
	OperatingSystemVersion *string
	Referrer               *string
	SiteID                 uint
	TimeZone               *string
	Url                    string
	UserAgent              string
	UtmCampaign            *string
	UtmContent             *string
	UtmMedium              *string
	UtmSource              *string
	UtmTerm                *string
	VisitorID              string
}

type Organization struct {
	CreatedAt               time.Time
	GoogleOauthRefreshToken *string
	ID                      uint
	IsOnTrial               bool
	Name                    string
	Plan                    *Plan
	PlanID                  *uint
	StripeCustomerID        *string
	SubscriptionPeriod      *string
	TrialEndsAt             *time.Time
	UpdatedAt               time.Time
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

func (e *Event) FillFromUrl(url string, safeQueryParameters []string) error {
	u, err := url2.Parse(url)
	if err != nil {
		return err
	}

	e.UtmCampaign = PointerOrNil(u.Query().Get("utm_campaign"))
	e.UtmContent = PointerOrNil(u.Query().Get("utm_content"))
	e.UtmMedium = PointerOrNil(u.Query().Get("utm_medium"))
	e.UtmSource = PointerOrNil(u.Query().Get("utm_source"))
	e.UtmTerm = PointerOrNil(u.Query().Get("utm_term"))

	safeQueryParametersMap := map[string]bool{}

	for _, queryParameter := range safeQueryParameters {
		safeQueryParametersMap[queryParameter] = true
	}

	q := u.Query()

	for k := range u.Query() {
		if !safeQueryParametersMap[k] {
			q.Del(k)
		}
	}

	u.RawQuery = q.Encode()
	e.Url = u.String()

	return nil
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
		e.DeviceType = Pointer(EventDeviceTypeDesktop)
	} else if ua.Mobile {
		e.DeviceType = Pointer(EventDeviceTypeMobile)
	} else if ua.Tablet {
		e.DeviceType = Pointer(EventDeviceTypeTablet)
	}
}

func (e *Event) TableName() string {
	return "events_buffer"
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
