package bootstrap

import (
	"context"
	_ "embed"
	"fmt"
	"strings"
	"time"

	v "github.com/RussellLuo/validating/v3"
	"github.com/brianvoe/gofakeit/v7"
	"github.com/google/uuid"
	"github.com/th0th/validatingextra"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/analytics"
)

const (
	batches       = 1000
	eventsInBatch = 100
)

type NewParams struct {
	Clickhouse *gorm.DB
	EnvService analytics.EnvService
	Postgres   *gorm.DB
}

type service struct {
	clickhouse *gorm.DB
	envService analytics.EnvService
	postgres   *gorm.DB
}

func New(params NewParams) analytics.BootstrapService {
	return &service{
		clickhouse: params.Clickhouse,
		envService: params.EnvService,
		postgres:   params.Postgres,
	}
}

func generateSlice[T any](count int, f func() T) []T {
	s := []T{}

	for i := 0; i < count; i += 1 {
		s = append(s, f())
	}

	return s
}

func randomUrlPath() string {
	return fmt.Sprintf("/%s", strings.SplitN(gofakeit.URL(), "/", 4)[3])
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}

func (s *service) Check(ctx context.Context) error {
	postgres := analytics.ServicePostgres(ctx, s)

	var planCount int64
	err := postgres.Model(&analytics.Plan{}).Count(&planCount).Error
	if err != nil {
		return err
	}

	if planCount != 0 {
		return analytics.BootstrapServiceErrAlreadyDone
	}

	return nil
}

func (s *service) Run(ctx context.Context, params *analytics.BootstrapServiceRunParams) (*analytics.User, error) {
	err := s.validateRunParams(ctx, params)
	if err != nil {
		return nil, err
	}

	postgres := analytics.ServicePostgres(ctx, s)

	err = s.validateRunParams(ctx, params)
	if err != nil {
		return nil, err
	}

	var plans []*analytics.Plan

	if s.envService.IsHosted() {
		plans = []*analytics.Plan{
			{
				Id:                1,
				MaxEventsPerMonth: 100000,
				MaxUsers:          1,
				Name:              "Basic",
				StripeProductId:   analytics.Pointer("prod_KXK6a9Zmy3qcLz"),
			},
			{
				Id:                2,
				MaxEventsPerMonth: 1000000,
				MaxUsers:          3,
				Name:              "Pro",
				StripeProductId:   analytics.Pointer("prod_KXK7HFnQGBmP6D"),
			},
			{
				Id:                3,
				MaxEventsPerMonth: 5000000,
				MaxUsers:          50,
				Name:              "Business",
				StripeProductId:   analytics.Pointer("prod_KXK83fu8EQrKfM"),
			},
		}
	} else {
		plans = []*analytics.Plan{
			{
				Id:   1,
				Name: "Default",
			},
		}
	}

	organization := analytics.Organization{
		Id:     1,
		Name:   *params.OrganizationName,
		PlanId: &plans[len(plans)-1].Id,
	}

	user := analytics.User{
		Email:               *params.UserEmail,
		Id:                  1,
		IsActive:            true,
		IsEmailVerified:     true,
		IsOrganizationOwner: true,
		Name:                *params.UserName,
		OrganizationId:      organization.Id,
	}
	err = user.SetPassword(*params.UserPassword)
	if err != nil {
		return nil, err
	}

	site := &analytics.Site{
		Domain:         "demo.yoursite.tld",
		HasEvents:      true,
		Id:             1,
		IsPublic:       false,
		Name:           "Demo site",
		OrganizationId: organization.Id,
	}

	var sequenceResetQueries []string

	err = postgres.Raw(sequenceResetQueriesQuery).Find(&sequenceResetQueries).Error
	if err != nil {
		return nil, err
	}

	err = analytics.ServicePostgresTransaction(ctx, s, func(ctx2 context.Context) error {
		postgres2 := analytics.ServicePostgres(ctx2, s)

		err2 := postgres2.Create(&plans).Error
		if err2 != nil {
			return err2
		}

		err2 = postgres2.Create(&organization).Error
		if err2 != nil {
			return err2
		}

		err2 = postgres2.Create(&user).Error
		if err2 != nil {
			return err2
		}

		if *params.CreateDemoSite {
			err2 = postgres2.Create(&site).Error
			if err2 != nil {
				return err2
			}
		}

		for i := range sequenceResetQueries {
			err2 = postgres2.Exec(sequenceResetQueries[i]).Error
			if err2 != nil {
				return err2
			}
		}

		if *params.CreateDemoSite {
			now := time.Now()

			referrerSites := generateSlice(35, func() string {
				protocol := gofakeit.RandomString([]string{"http", "https"})

				return fmt.Sprintf("%s://%s", protocol, gofakeit.DomainName())
			})
			referrerPaths := generateSlice(100, randomUrlPath)
			urls := generateSlice(35, func() string { return fmt.Sprintf("https://%s%s", site.Domain, randomUrlPath()) })
			utmSources := generateSlice(35, gofakeit.Word)
			utmCampaigns := generateSlice(35, gofakeit.Word)
			utmMediums := generateSlice(35, gofakeit.Word)
			utmContents := generateSlice(35, gofakeit.Word)
			utmTerms := generateSlice(35, gofakeit.Word)
			visitorIds := generateSlice(4000, gofakeit.UUID)
			userAgents := generateSlice(100, gofakeit.UserAgent)

			for i := 0; i < batches; i += 1 {
				events := []*analytics.Event{}

				for j := 0; j < eventsInBatch; j += 1 {
					languageBcp := gofakeit.LanguageBCP()
					timeZone := gofakeit.TimeZoneRegion()

					event := analytics.Event{
						//CountryIsoCode: country.GetIsoCodeFromTimeZoneName(timeZone),
						DateTime: gofakeit.DateRange(now.Add(-31*24*time.Hour), now),
						Duration: time.Duration(gofakeit.IntRange(1, 1200)) * time.Second,
						Id:       uuid.NewString(),
						Kind:     analytics.EventKindPageView,
						//Language:       locale.GetLanguage(languageBcp),
						Locale:   &languageBcp,
						SiteId:   site.Id,
						TimeZone: &timeZone,
					}

					if gofakeit.Bool() {
						event.Referrer = analytics.Pointer(fmt.Sprintf("%s%s", gofakeit.RandomString(referrerSites), gofakeit.RandomString(referrerPaths)))
					}

					err = event.FillFromUrl(gofakeit.RandomString(urls), nil)
					if err != nil {
						return err
					}

					event.FillFromUserAgent(gofakeit.RandomString(userAgents))

					event.VisitorId = gofakeit.RandomString(visitorIds)

					if gofakeit.Bool() && gofakeit.Bool() {
						event.UtmSource = analytics.Pointer(gofakeit.RandomString(utmSources))
						event.UtmCampaign = analytics.Pointer(gofakeit.RandomString(utmCampaigns))
						event.UtmMedium = analytics.Pointer(gofakeit.RandomString(utmMediums))
						event.UtmContent = analytics.Pointer(gofakeit.RandomString(utmContents))
						event.UtmTerm = analytics.Pointer(gofakeit.RandomString(utmTerms))
					}

					events = append(events, &event)
				}

				err = s.clickhouse.Create(events).Error
				if err != nil {
					return err
				}
			}
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (s *service) validateRunParams(ctx context.Context, params *analytics.BootstrapServiceRunParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("createDemoSite", params.CreateDemoSite): v.All(
			v.Nonzero[*bool]().Msg("This field is required."),
		),

		v.F("organizationName", params.OrganizationName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			validatingextra.PointerValue[string](
				v.LenString(analytics.OrganizationNameMinLength, analytics.OrganizationNameMaxLength).Msg(fmt.Sprintf(
					"The organization name must be between %d and %d characters long.",
					analytics.OrganizationNameMinLength,
					analytics.OrganizationNameMaxLength,
				)),
			),
		),

		v.F("userEmail", params.UserEmail): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			validatingextra.PointerValue[string](validatingextra.Email().Msg("Please provide a valid e-mail address.")),

			validatingextra.PointerValue[string](validatingextra.EmailNonDisposable().Msg("Please provide a non-disposable e-mail address.")),
		),

		v.F("userName", params.UserName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			validatingextra.PointerValue[string](
				v.LenString(analytics.UserNameMinLength, analytics.UserNameMaxLength).Msg(fmt.Sprintf(
					"The user name must be between %d and %d characters long.",
					analytics.UserNameMinLength,
					analytics.UserNameMaxLength,
				)),
			),
		),

		v.F("userPassword", params.UserPassword): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			validatingextra.PointerValue[string](
				v.LenString(analytics.UserPasswordMinLength, analytics.UserPasswordMaxLength).Msg(fmt.Sprintf(
					"The password must be between %d and %d characters long.",
					analytics.UserPasswordMinLength,
					analytics.UserPasswordMaxLength,
				)),
			),
		),

		v.F("userPassword2", params.UserPassword2): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(x *string) bool {
				if params.UserPassword != nil && params.UserPassword2 != nil {
					return *params.UserPassword == *params.UserPassword2
				}

				return true
			}).Msg("Passwords do not match."),
		),
	})

	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

//go:embed files/get_sequence_reset_queries.sql
var sequenceResetQueriesQuery string
