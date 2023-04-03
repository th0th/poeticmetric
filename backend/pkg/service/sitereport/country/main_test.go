package country

import (
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
)

var (
	dp *depot.Depot
)

func TestGet(t *testing.T) {
	modelSite := h.Site(dp, nil)

	start, err := time.Parse("2006-01-02", "2022-01-01")
	assert.NoError(t, err)

	end, err := time.Parse("2006-01-02", "2022-12-31")
	assert.NoError(t, err)

	events := []*model.Event{}

	testData := []struct {
		CountryIsoCode *string
		VisitorCount   int
	}{
		{CountryIsoCode: nil, VisitorCount: 237},
		{CountryIsoCode: pointer.Get("TUR"), VisitorCount: 628},
		{CountryIsoCode: pointer.Get("DEU"), VisitorCount: 470},
		{CountryIsoCode: pointer.Get("USA"), VisitorCount: 387},
		{CountryIsoCode: pointer.Get("IND"), VisitorCount: 226},
		{CountryIsoCode: pointer.Get("EST"), VisitorCount: 195},
		{CountryIsoCode: pointer.Get("BLR"), VisitorCount: 59},
		{CountryIsoCode: pointer.Get("SWE"), VisitorCount: 25},
		{CountryIsoCode: pointer.Get("UKR"), VisitorCount: 4},
		{CountryIsoCode: pointer.Get("GBR"), VisitorCount: 3},
		{CountryIsoCode: pointer.Get("ITA"), VisitorCount: 2},
		{CountryIsoCode: pointer.Get("GRC"), VisitorCount: 1},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				CountryIsoCode: d.CountryIsoCode,
				DateTime:       gofakeit.DateRange(start, end),
				Id:             uuid.NewString(),
				SiteId:         modelSite.Id,
				VisitorId:      uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(&events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &filter.Filters{
		End:    end,
		SiteId: modelSite.Id,
		Start:  start,
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{Country: "Turkey", CountryIsoCode: "TUR", VisitorCount: 628, VisitorPercentage: 31},
		{Country: "Germany", CountryIsoCode: "DEU", VisitorCount: 470, VisitorPercentage: 24},
		{Country: "United States", CountryIsoCode: "USA", VisitorCount: 387, VisitorPercentage: 19},
		{Country: "India", CountryIsoCode: "IND", VisitorCount: 226, VisitorPercentage: 11},
		{Country: "Estonia", CountryIsoCode: "EST", VisitorCount: 195, VisitorPercentage: 10},
		{Country: "Belarus", CountryIsoCode: "BLR", VisitorCount: 59, VisitorPercentage: 3},
		{Country: "Sweden", CountryIsoCode: "SWE", VisitorCount: 25, VisitorPercentage: 1},
		{Country: "Ukraine", CountryIsoCode: "UKR", VisitorCount: 4, VisitorPercentage: 0},
		{Country: "United Kingdom", CountryIsoCode: "GBR", VisitorCount: 3, VisitorPercentage: 0},
		{Country: "Italy", CountryIsoCode: "ITA", VisitorCount: 2, VisitorPercentage: 0},
		{Country: "Greece", CountryIsoCode: "GRC", VisitorCount: 1, VisitorPercentage: 0},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
