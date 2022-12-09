package siteoperatingsystemnamereport

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
		OperatingSystemName *string
		VisitorCount        int
	}{
		{OperatingSystemName: nil, VisitorCount: 237},
		{OperatingSystemName: pointer.Get("GNU/Linux"), VisitorCount: 62},
		{OperatingSystemName: pointer.Get("macOS"), VisitorCount: 56},
		{OperatingSystemName: pointer.Get("Windows"), VisitorCount: 46},
		{OperatingSystemName: pointer.Get("iOS"), VisitorCount: 36},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:            gofakeit.DateRange(start, end),
				Id:                  uuid.NewString(),
				OperatingSystemName: d.OperatingSystemName,
				SiteId:              modelSite.Id,
				VisitorId:           uuid.NewString(),
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
			OperatingSystemName: "GNU/Linux",
			VisitorCount:        62,
			VisitorPercentage:   31,
		},
		{
			OperatingSystemName: "macOS",
			VisitorCount:        56,
			VisitorPercentage:   28,
		},
		{
			OperatingSystemName: "Windows",
			VisitorCount:        46,
			VisitorPercentage:   23,
		},
		{
			OperatingSystemName: "iOS",
			VisitorCount:        36,
			VisitorPercentage:   18,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
