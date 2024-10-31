package bootstrap

import (
	"context"
	_ "embed"
	"fmt"
	"strings"
	"time"

	"github.com/RussellLuo/validating/v3"
	"github.com/brianvoe/gofakeit/v7"
	"github.com/go-errors/errors"
	"github.com/google/uuid"
	"github.com/th0th/validatingextra"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/pkg/poeticmetric"
)

const batches = 1000
const eventsInBatch = 100

type NewParams struct {
	Clickhouse *gorm.DB
	EnvService poeticmetric.EnvService
	Postgres   *gorm.DB
}

type service struct {
	clickhouse *gorm.DB
	envService poeticmetric.EnvService
	postgres   *gorm.DB
}

func New(params NewParams) poeticmetric.BootstrapService {
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
	postgres := poeticmetric.ServicePostgres(ctx, s)

	var planCount int64
	err := postgres.Model(&poeticmetric.Plan{}).Count(&planCount).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	if planCount != 0 {
		return errors.Wrap(poeticmetric.BootstrapServiceErrAlreadyDone, 0)
	}

	return nil
}

func (s *service) Done(ctx context.Context) (bool, error) {
	postgres := poeticmetric.ServicePostgres(ctx, s)
	err := postgres.Model(poeticmetric.Plan{}).First(&poeticmetric.Plan{}).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}

		return false, err
	}

	return true, nil
}

func (s *service) Run(ctx context.Context, params *poeticmetric.BootstrapServiceRunParams) (*poeticmetric.User, error) {
	err := s.validateRunParams(ctx, params)
	if err != nil {
		return nil, err
	}

	postgres := poeticmetric.ServicePostgres(ctx, s)

	err = s.validateRunParams(ctx, params)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	var plans []*poeticmetric.Plan

	if s.envService.IsHosted() {
		plans = []*poeticmetric.Plan{
			{
				Id:                1,
				MaxEventsPerMonth: 100000,
				MaxUsers:          1,
				Name:              "Basic",
				StripeProductId:   poeticmetric.Pointer("prod_KXK6a9Zmy3qcLz"),
			},
			{
				Id:                2,
				MaxEventsPerMonth: 1000000,
				MaxUsers:          3,
				Name:              "Pro",
				StripeProductId:   poeticmetric.Pointer("prod_KXK7HFnQGBmP6D"),
			},
			{
				Id:                3,
				MaxEventsPerMonth: 5000000,
				MaxUsers:          50,
				Name:              "Business",
				StripeProductId:   poeticmetric.Pointer("prod_KXK83fu8EQrKfM"),
			},
		}
	} else {
		plans = []*poeticmetric.Plan{
			{
				Id:   1,
				Name: "Default",
			},
		}
	}

	organization := poeticmetric.Organization{
		Id:     1,
		Name:   params.OrganizationName,
		PlanId: &plans[len(plans)-1].Id,
	}

	user := poeticmetric.User{
		Email:               params.UserEmail,
		Id:                  1,
		IsActive:            true,
		IsEmailVerified:     true,
		IsOrganizationOwner: true,
		Name:                params.UserName,
		OrganizationId:      organization.Id,
	}
	err = user.SetPassword(params.UserPassword)
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	site := &poeticmetric.Site{
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
		return nil, errors.Wrap(err, 0)
	}

	err = poeticmetric.ServicePostgresTransaction(ctx, s, func(ctx2 context.Context) error {
		postgres2 := poeticmetric.ServicePostgres(ctx2, s)

		err2 := postgres2.Create(&plans).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = postgres2.Create(&organization).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = postgres2.Create(&user).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		if params.CreateDemoSite {
			err2 = postgres2.Create(&site).Error
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}
		}

		for i := range sequenceResetQueries {
			err2 = postgres2.Exec(sequenceResetQueries[i]).Error
			if err2 != nil {
				return errors.Wrap(err2, 0)
			}
		}

		if params.CreateDemoSite {
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
				events := []*poeticmetric.Event{}

				for j := 0; j < eventsInBatch; j += 1 {
					languageBcp := gofakeit.LanguageBCP()
					timeZone := gofakeit.TimeZoneRegion()

					event := poeticmetric.Event{
						//CountryIsoCode: country.GetIsoCodeFromTimeZoneName(timeZone),
						DateTime: gofakeit.DateRange(now.Add(-31*24*time.Hour), now),
						Duration: time.Duration(gofakeit.IntRange(1, 1200)) * time.Second,
						Id:       uuid.NewString(),
						Kind:     poeticmetric.EventKindPageView,
						//Language:       locale.GetLanguage(languageBcp),
						Locale:   &languageBcp,
						SiteId:   site.Id,
						TimeZone: &timeZone,
					}

					if gofakeit.Bool() {
						event.Referrer = poeticmetric.Pointer(fmt.Sprintf("%s%s", gofakeit.RandomString(referrerSites), gofakeit.RandomString(referrerPaths)))
					}

					err = event.FillFromUrl(gofakeit.RandomString(urls), nil)
					if err != nil {
						return errors.Wrap(err, 0)
					}

					event.FillFromUserAgent(gofakeit.RandomString(userAgents))

					event.VisitorId = gofakeit.RandomString(visitorIds)

					if gofakeit.Bool() && gofakeit.Bool() { //nolint:gosec
						event.UtmSource = poeticmetric.Pointer(gofakeit.RandomString(utmSources))
						event.UtmCampaign = poeticmetric.Pointer(gofakeit.RandomString(utmCampaigns))
						event.UtmMedium = poeticmetric.Pointer(gofakeit.RandomString(utmMediums))
						event.UtmContent = poeticmetric.Pointer(gofakeit.RandomString(utmContents))
						event.UtmTerm = poeticmetric.Pointer(gofakeit.RandomString(utmTerms))
					}

					events = append(events, &event)
				}

				err = s.clickhouse.Create(events).Error
				if err != nil {
					return errors.Wrap(err, 0)
				}
			}
		}

		return nil
	})
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	return &user, nil
}

func (s *service) validateRunParams(ctx context.Context, params *poeticmetric.BootstrapServiceRunParams) error {
	validationErrs := validating.Validate(validating.Schema{
		validating.F("OrganizationName", params.OrganizationName): validating.All(
			validating.Nonzero[string]().Msg("This field is required."),

			validating.LenString(poeticmetric.OrganizationNameMinLength, poeticmetric.OrganizationNameMaxLength).Msg(fmt.Sprintf(
				"This field must be between %d and %d characters in length.",
				poeticmetric.OrganizationNameMinLength,
				poeticmetric.OrganizationNameMaxLength,
			)),
		),

		validating.F("UserEmail", params.UserEmail): validating.All(
			validating.Nonzero[string]().Msg("This field is required."),

			validatingextra.Email().Msg("Please provide a valid e-mail address."),

			validatingextra.EmailNonDisposable().Msg("Please provide a non-disposable e-mail address."),
		),

		validating.F("UserName", params.UserName): validating.All(
			validating.Nonzero[string]().Msg("This field is required."),

			validating.LenString(poeticmetric.UserNameMinLength, poeticmetric.UserNameMaxLength).Msg(fmt.Sprintf(
				"This field must be between %d and %d characters in length.",
				poeticmetric.UserNameMinLength,
				poeticmetric.UserNameMaxLength,
			)),
		),

		validating.F("UserPassword", params.UserPassword): validating.All(
			validating.Nonzero[string]().Msg("This field is required."),

			validating.LenString(poeticmetric.UserPasswordMinLength, poeticmetric.UserPasswordMaxLength).Msg(fmt.Sprintf(
				"This field must be between %d and %d characters in length.",
				poeticmetric.UserPasswordMinLength,
				poeticmetric.UserPasswordMaxLength,
			)),
		),

		validating.F("UserPassword2", params.UserPassword2): validating.All(
			validating.Nonzero[string]().Msg("This field is required."),

			validating.Eq(params.UserPassword).Msg("Passwords do not match."),
		),
	})
	if len(validationErrs) > 0 {
		return validationErrs
	}

	return nil
}

//go:embed files/get_sequence_reset_queries.sql
var sequenceResetQueriesQuery string
