package country

import (
	"errors"
	"math"
	"sort"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/th0th/poeticmetric/backend/pkg/country"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
)

func TestGet(t *testing.T) {
	type TestDatum struct {
		Country        string
		CountryIsoCode string
		VisitorCount   uint64
	}

	dp := h.NewDepot()

	_ = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		start, err := time.Parse("2006-01-02", "2022-01-01")
		assert.NoError(t, err)

		end, err := time.Parse("2006-01-02", "2022-12-31")
		assert.NoError(t, err)

		countries := []country.Country{}

		for _, c := range country.Countries {
			countries = append(countries, c)
		}

		gofakeit.ShuffleAnySlice(countries)
		countries = countries[0:20]

		testData := []*TestDatum{}

		var totalVisitorCount uint64

		for _, c := range countries {
			visitorCount := uint64(gofakeit.IntRange(0, 1000))

			totalVisitorCount += visitorCount

			testData = append(testData, &TestDatum{
				Country:        c.Name,
				CountryIsoCode: c.IsoCode,
				VisitorCount:   visitorCount,
			})
		}

		sort.Slice(testData, func(i, j int) bool {
			if testData[i].VisitorCount > testData[j].VisitorCount {
				return true
			}

			if testData[i].VisitorCount == testData[j].VisitorCount {
				return testData[i].CountryIsoCode > testData[j].CountryIsoCode
			}

			return false
		})

		modelSite := h.Site(dp2, nil)
		events := []*model.Event{}

		for _, testDatum := range testData {
			for visitorIndex := 0; uint64(visitorIndex) < testDatum.VisitorCount; visitorIndex += 1 {
				events = append(events, &model.Event{
					CountryIsoCode: &testDatum.CountryIsoCode,
					DateTime:       gofakeit.DateRange(start, end),
					Id:             uuid.NewString(),
					Kind:           model.EventKindPageView,
					SiteId:         modelSite.Id,
					VisitorId:      uuid.NewString(),
				})
			}
		}

		err = dp2.ClickHouse().
			Create(&events).
			Error
		assert.NoError(t, err)

		report, err := Get(dp2, &filter.Filters{
			End:    end,
			SiteId: modelSite.Id,
			Start:  start,
		})
		assert.NoError(t, err)

		expectedReport := Report{}

		for _, testDatum := range testData {
			expectedReport = append(expectedReport, &Datum{
				Country:           testDatum.Country,
				CountryIsoCode:    testDatum.CountryIsoCode,
				VisitorCount:      testDatum.VisitorCount,
				VisitorPercentage: uint16(math.Round(100 * float64(testDatum.VisitorCount) / float64(totalVisitorCount))),
			})
		}

		assert.Equal(t, expectedReport, report)

		err = dp2.ClickHouse().
			Exec("optimize table events_buffer").
			Error
		assert.NoError(t, err)

		err = dp2.ClickHouse().
			Table("events").
			Where("site_id = ?", modelSite.Id).
			Delete(nil).
			Error
		if err != nil {
			return err
		}

		return errors.New("")
	})
}
