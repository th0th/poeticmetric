package sitecountryreport

import (
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/poeticmetric/poeticmetric/backend/pkg/testhelper"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
	"time"
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
		{CountryIsoCode: pointer.Get("TUR"), VisitorCount: 52},
		{CountryIsoCode: pointer.Get("DEU"), VisitorCount: 34},
		{CountryIsoCode: pointer.Get("USA"), VisitorCount: 14},
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
		{
			Country:           "Turkey",
			CountryIsoCode:    "TUR",
			VisitorCount:      52,
			VisitorPercentage: 52,
		},
		{
			Country:           "Germany",
			CountryIsoCode:    "DEU",
			VisitorCount:      34,
			VisitorPercentage: 34,
		},
		{
			Country:           "United States",
			CountryIsoCode:    "USA",
			VisitorCount:      14,
			VisitorPercentage: 14,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
