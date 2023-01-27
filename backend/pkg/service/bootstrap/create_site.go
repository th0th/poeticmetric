package bootstrap

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/country"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/poeticmetric/poeticmetric/backend/pkg/locale"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	h "github.com/poeticmetric/poeticmetric/backend/pkg/testhelper"
	"time"
)

const batches = 1000
const eventsInBatch = 100

func createSite(dp *depot.Depot) error {
	modelSite := &model.Site{
		Domain:              "demo.yoursite.tld",
		Id:                  1,
		Name:                "Demo Site",
		OrganizationId:      1,
		SafeQueryParameters: []string{},
	}

	if env.GetIsHosted() {
		modelSite.Domain = "dev.poeticmetric.com"
		modelSite.Name = "PoeticMetric Dev"
	}

	err := dp.Postgres().
		Create(modelSite).
		Error
	if err != nil {
		return err
	}

	now := time.Now()

	referrerSites := generateSlice(35, func() string {
		protocol := gofakeit.RandomString([]string{"http", "https"})

		return fmt.Sprintf("%s://%s", protocol, gofakeit.DomainName())
	})
	referrerPaths := generateSlice(100, h.GetRandomUrlPath)
	urls := generateSlice(35, func() string { return fmt.Sprintf("https://%s%s", modelSite.Domain, h.GetRandomUrlPath()) })
	utmSources := generateSlice(35, gofakeit.Word)
	utmCampaigns := generateSlice(35, gofakeit.Word)
	utmMediums := generateSlice(35, gofakeit.Word)
	utmContents := generateSlice(35, gofakeit.Word)
	utmTerms := generateSlice(35, gofakeit.Word)
	visitorIds := generateSlice(4000, gofakeit.UUID)
	userAgents := generateSlice(100, gofakeit.UserAgent)

	for i := 0; i < batches; i += 1 {
		events := []*model.Event{}

		for j := 0; j < eventsInBatch; j += 1 {
			languageBcp := gofakeit.LanguageBCP()
			timeZone := gofakeit.TimeZoneRegion()

			event := &model.Event{
				CountryIsoCode: country.GetIsoCodeFromTimeZoneName(timeZone),
				DateTime:       gofakeit.DateRange(now.Add(-31*24*time.Hour), now),
				Duration:       uint32(gofakeit.IntRange(1, 1200)),
				Id:             uuid.NewString(),
				Kind:           model.EventKindPageView,
				Language:       locale.GetLanguage(languageBcp),
				Locale:         &languageBcp,
				SiteId:         modelSite.Id,
				TimeZone:       &timeZone,
			}

			if gofakeit.Bool() {
				event.Referrer = pointer.Get(fmt.Sprintf("%s%s", gofakeit.RandomString(referrerSites), gofakeit.RandomString(referrerPaths)))
			}

			if gofakeit.Bool() && gofakeit.Bool() {
				event.UtmSource = pointer.Get(gofakeit.RandomString(utmSources))
				event.UtmCampaign = pointer.Get(gofakeit.RandomString(utmCampaigns))
				event.UtmMedium = pointer.Get(gofakeit.RandomString(utmMediums))
				event.UtmContent = pointer.Get(gofakeit.RandomString(utmContents))
				event.UtmTerm = pointer.Get(gofakeit.RandomString(utmTerms))
			}

			if gofakeit.Bool() && gofakeit.Bool() && gofakeit.Bool() {
				event.IsBounce = true
			}

			event.FillFromUrl(gofakeit.RandomString(urls), nil)
			event.FillFromUserAgent(gofakeit.RandomString(userAgents))

			event.VisitorId = gofakeit.RandomString(visitorIds)

			events = append(events, event)
		}

		err := dp.ClickHouse().Table("events_buffer").Create(&events).Error
		if err != nil {
			return err
		}
	}

	return nil
}

func generateSlice[T any](count int, f func() T) []T {
	s := []T{}

	for i := 0; i < count; i += 1 {
		s = append(s, f())
	}

	return s
}
