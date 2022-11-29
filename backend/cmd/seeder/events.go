package main

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/country"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/locale"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"strings"
	"time"
)

const batches = 10
const eventsInBatch = 1000

func seedEvents(dp *depot.Depot, clear bool, modelSite *model.Site) error {
	now := time.Now()

	if clear {
		err := dp.ClickHouse().
			Exec("set mutations_sync = 1").
			Error
		if err != nil {
			return err
		}

		err = dp.ClickHouse().
			Exec("optimize table events_buffer").
			Error
		if err != nil {
			return err
		}

		err = dp.ClickHouse().
			Exec("alter table events delete where 1 = 1").
			Error
		if err != nil {
			return err
		}

		err = dp.ClickHouse().
			Exec("set mutations_sync = 0").
			Error
		if err != nil {
			return err
		}
	}

	referrerDomains := []string{
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
		gofakeit.DomainName(),
	}

	referrerPaths := []string{
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
	}

	urlPaths := []string{
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
		getRandomUrlPath(),
	}

	utmSources := []string{
		"email",
		"facebook",
		"github",
		"linkedin",
		"twitter",
	}

	utmCampaigns := []string{
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
	}

	utmMediums := []string{
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
	}

	utmContents := []string{
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
		gofakeit.BuzzWord(),
	}

	utmTerms := []string{
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
		gofakeit.HipsterWord(),
	}

	for i := 0; i < batches; i += 1 {
		events := []*model.Event{}

		for j := 0; j < eventsInBatch; j += 1 {
			languageBcp := gofakeit.LanguageBCP()
			timeZone := gofakeit.TimeZoneRegion()
			userAgent := gofakeit.UserAgent()

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
				event.Referrer = pointer.Get(
					fmt.Sprintf(
						"https://%s%s",
						gofakeit.RandomString(referrerDomains),
						gofakeit.RandomString(referrerPaths),
					),
				)
			}

			if gofakeit.Bool() && gofakeit.Bool() {
				event.UtmSource = pointer.Get(gofakeit.RandomString(utmSources))
				event.UtmCampaign = pointer.Get(gofakeit.RandomString(utmCampaigns))
				event.UtmMedium = pointer.Get(gofakeit.RandomString(utmMediums))
				event.UtmContent = pointer.Get(gofakeit.RandomString(utmContents))
				event.UtmTerm = pointer.Get(gofakeit.RandomString(utmTerms))
			}

			url := fmt.Sprintf("https://%s%s", modelSite.Domain, gofakeit.RandomString(urlPaths))

			event.FillFromUrl(url)
			event.FillFromUserAgent(userAgent)
			event.FillVisitorId(gofakeit.IPv4Address(), userAgent)

			events = append(events, event)
		}

		err := dp.ClickHouse().Table("events_buffer").Create(&events).Error
		if err != nil {
			return err
		}
	}

	return nil
}

func getRandomUrlPath() string {
	return fmt.Sprintf("/%s", strings.SplitN(gofakeit.URL(), "/", 4)[3])
}
