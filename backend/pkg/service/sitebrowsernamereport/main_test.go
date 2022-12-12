package sitebrowsernamereport

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
		BrowserName  *string
		VisitorCount int
	}{
		{BrowserName: nil, VisitorCount: 237},
		{BrowserName: pointer.Get("Chrome"), VisitorCount: 31},
		{BrowserName: pointer.Get("Firefox"), VisitorCount: 28},
		{BrowserName: pointer.Get("Safari"), VisitorCount: 23},
		{BrowserName: pointer.Get("Edge"), VisitorCount: 18},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				BrowserName: d.BrowserName,
				DateTime:    gofakeit.DateRange(start, end),
				Id:          uuid.NewString(),
				SiteId:      modelSite.Id,
				VisitorId:   uuid.NewString(),
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
			BrowserName:       "Chrome",
			VisitorCount:      31,
			VisitorPercentage: 31,
		},
		{
			BrowserName:       "Firefox",
			VisitorCount:      28,
			VisitorPercentage: 28,
		},
		{
			BrowserName:       "Safari",
			VisitorCount:      23,
			VisitorPercentage: 23,
		},
		{
			BrowserName:       "Edge",
			VisitorCount:      18,
			VisitorPercentage: 18,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
