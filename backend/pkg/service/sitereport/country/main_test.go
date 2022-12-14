<<<<<<<< HEAD:backend/pkg/service/sitereport/country/main_test.go
package country
========
package language
>>>>>>>> development:backend/pkg/service/sitereport/language/main_test.go

import (
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/poeticmetric/poeticmetric/backend/pkg/testhelper"
	"github.com/stretchr/testify/assert"
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

<<<<<<<< HEAD:backend/pkg/service/sitereport/country/main_test.go
========
	modelSite := h.Site(dp, nil)

	testData := []*struct {
		Language     string
		VisitorCount int
	}{
		{Language: "English", VisitorCount: 652},
		{Language: "Turkish", VisitorCount: 292},
		{Language: "German", VisitorCount: 147},
		{Language: "French", VisitorCount: 144},
		{Language: "Spanish", VisitorCount: 128},
		{Language: "Hindi", VisitorCount: 116},
		{Language: "Portuguese", VisitorCount: 109},
		{Language: "Russian", VisitorCount: 107},
		{Language: "Japanese", VisitorCount: 104},
		{Language: "Korean", VisitorCount: 101},
		{Language: "Italian", VisitorCount: 100},
	}

>>>>>>>> development:backend/pkg/service/sitereport/language/main_test.go
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
	}, nil)
	assert.NoError(t, err)

<<<<<<<< HEAD:backend/pkg/service/sitereport/country/main_test.go
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
========
	// total is 2000
	expectedReport := &Report{
		Data: []*Datum{
			{Language: "English", VisitorCount: 652, VisitorPercentage: 33},
			{Language: "Turkish", VisitorCount: 292, VisitorPercentage: 15},
			{Language: "German", VisitorCount: 147, VisitorPercentage: 7},
			{Language: "French", VisitorCount: 144, VisitorPercentage: 7},
			{Language: "Spanish", VisitorCount: 128, VisitorPercentage: 6},
			{Language: "Hindi", VisitorCount: 116, VisitorPercentage: 6},
			{Language: "Portuguese", VisitorCount: 109, VisitorPercentage: 5},
			{Language: "Russian", VisitorCount: 107, VisitorPercentage: 5},
			{Language: "Japanese", VisitorCount: 104, VisitorPercentage: 5},
			{Language: "Korean", VisitorCount: 101, VisitorPercentage: 5},
		},
		PaginationCursor: &PaginationCursor{Language: "Korean", VisitorCount: 101},
>>>>>>>> development:backend/pkg/service/sitereport/language/main_test.go
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
