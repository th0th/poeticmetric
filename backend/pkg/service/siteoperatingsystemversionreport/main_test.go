package siteoperatingsystemversionreport

import (
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
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

	operatingSystemName := "macOS"

	events := []*model.Event{}

	testData := []struct {
		OperatingSystemVersion *string
		VisitorCount           int
	}{
		{OperatingSystemVersion: nil, VisitorCount: 237},
		{OperatingSystemVersion: pointer.Get("10.8.10"), VisitorCount: 66},
		{OperatingSystemVersion: pointer.Get("10.8.8"), VisitorCount: 59},
		{OperatingSystemVersion: pointer.Get("10.7.0"), VisitorCount: 40},
		{OperatingSystemVersion: pointer.Get("10.5.4"), VisitorCount: 35},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:               gofakeit.DateRange(start, end),
				Id:                     uuid.NewString(),
				OperatingSystemName:    &operatingSystemName,
				OperatingSystemVersion: d.OperatingSystemVersion,
				SiteId:                 modelSite.Id,
				VisitorId:              uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(&events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &sitereportfilters.Filters{
		End:                 end,
		OperatingSystemName: &operatingSystemName,
		SiteId:              modelSite.Id,
		Start:               start,
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{
			OperatingSystemVersion: "10.8.10",
			VisitorCount:           66,
			VisitorPercentage:      33,
		},
		{
			OperatingSystemVersion: "10.8.8",
			VisitorCount:           59,
			VisitorPercentage:      30,
		},
		{
			OperatingSystemVersion: "10.7.0",
			VisitorCount:           40,
			VisitorPercentage:      20,
		},
		{
			OperatingSystemVersion: "10.5.4",
			VisitorCount:           35,
			VisitorPercentage:      18,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
