package poeticmetric

import (
	"crypto/sha256"
	"fmt"
	"math/rand"
	"net/url"
	"strconv"
	"strings"
	"time"

	"github.com/dchest/uniuri"
	"github.com/go-errors/errors"
	"github.com/mileusna/useragent"
	"github.com/stripe/stripe-go/v82"
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
	LogKindUnverifiedOrganizationsDeletion LogKind = "UNVERIFIED_ORGANIZATIONS_DELETION"
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

type Log struct {
	Data     any `gorm:"serializer:json"`
	DateTime time.Time
	ID       uint
	Kind     LogKind
}

type LogKind string

type LogUnverifiedOrganizationsDeletionData []LogUnverifiedOrganizationsDeletionDatum

type LogUnverifiedOrganizationsDeletionDatum struct {
	OrganizationCreatedAt        time.Time  `json:"organizationCreatedAt"`
	OrganizationID               uint       `json:"organizationID"`
	OrganizationName             string     `json:"organizationName"`
	OrganizationUpdatedAt        time.Time  `json:"organizationUpdatedAt"`
	UserCreatedAt                time.Time  `json:"userCreatedAt"`
	UserEmail                    string     `json:"userEmail"`
	UserID                       uint       `json:"userID"`
	UserLastAccessTokenCreatedAt *time.Time `json:"userLastAccessTokenCreatedAt"`
	UserName                     string     `json:"userName"`
	UserUpdatedAt                time.Time  `json:"userUpdatedAt"`
}

type Organization struct {
	CreatedAt                     time.Time
	ID                            uint
	IsOnTrial                     bool
	Name                          string
	Plan                          *Plan
	PlanID                        uint
	StripeCustomerID              *string
	SubscriptionCancelAtPeriodEnd *bool
	SubscriptionPeriod            *string
	TimeZone                      string
	TrialEndsAt                   *time.Time
	UpdatedAt                     time.Time
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
	CreatedAt         time.Time
	DataRetentionDays *int
	ID                uint
	MaxEventsPerMonth *int
	MaxSiteCount      *int
	MaxUserCount      *int
	Name              string
	UpdatedAt         time.Time
}

type Site struct {
	CreatedAt                  time.Time
	Domain                     string
	GoogleOauthRefreshToken    *string
	GoogleSearchConsoleSiteURL *string
	HasEvents                  bool
	ID                         uint
	IsPublic                   bool
	Name                       string
	Organization               Organization
	OrganizationID             uint
	SafeQueryParameters        []string `gorm:"serializer:json"`
	UpdatedAt                  time.Time
}

type User struct {
	ActivationToken          *string
	CreatedAt                time.Time
	Email                    string
	EmailVerificationCode    *string
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

func PlanMaxEventsPerMonthChoices() []int {
	return []int{100000, 500000, 1000000, 2000000, 5000000}
}

func PlanStripePriceLookupKey(planName string, maxEventsPerMonth int, subscriptionPeriod string) string {
	maxEventsKey := fmt.Sprintf("%dk", maxEventsPerMonth/1000)
	if maxEventsPerMonth >= 1000000 {
		maxEventsKey = fmt.Sprintf("%dm", maxEventsPerMonth/1000000)
	}

	return strings.ToLower(fmt.Sprintf("%s_%s_%sly", planName, maxEventsKey, subscriptionPeriod))
}

func StripeIntervalOrganizationSubscriptionPeriod(stripePlanInterval stripe.PlanInterval) (string, error) {
	subscriptionPeriod := map[stripe.PlanInterval]string{
		stripe.PlanIntervalMonth: OrganizationSubscriptionPeriodMonth,
		stripe.PlanIntervalYear:  OrganizationSubscriptionPeriodYear,
	}[stripePlanInterval]

	if subscriptionPeriod == "" {
		return "", errors.Wrap(ErrInvalidStripePlanPeriod, 0)
	}

	return subscriptionPeriod, nil
}

func StripePriceLookupKeyPlanMaxEventsPerMonth(stripePriceLookupKey string) (int, error) {
	parts := strings.Split(stripePriceLookupKey, "_")
	if len(parts) != 3 {
		return 0, errors.Wrap(ErrInvalidStripePriceLookupKey, 0)
	}

	maxEventsPerMonthString := parts[1]
	maxEventsPerMonthString = strings.ReplaceAll(maxEventsPerMonthString, "k", "000")
	maxEventsPerMonthString = strings.ReplaceAll(maxEventsPerMonthString, "m", "000000")

	maxEventsPerMonth, err := strconv.Atoi(maxEventsPerMonthString)
	if err != nil {
		return 0, errors.Wrap(err, 0)
	}

	return maxEventsPerMonth, nil
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

func (u *User) SetEmailVerificationCode() {
	u.EmailVerificationCode = Pointer(fmt.Sprintf("%04d", rand.Intn(9999))) //nolint:gosec
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
