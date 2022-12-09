package siteutmsourcereport

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
		UtmSource    *string
		VisitorCount int
	}{
		{UtmSource: nil, VisitorCount: 237},
		{UtmSource: pointer.Get("twitter"), VisitorCount: 143},
		{UtmSource: pointer.Get("mastodon"), VisitorCount: 52},
		{UtmSource: pointer.Get("linkedin"), VisitorCount: 4},
		{UtmSource: pointer.Get("facebook"), VisitorCount: 1},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				SiteId:    modelSite.Id,
				UtmSource: d.UtmSource,
				VisitorId: uuid.NewString(),
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
			UtmSource:         "twitter",
			VisitorCount:      143,
			VisitorPercentage: 72,
		},
		{
			UtmSource:         "mastodon",
			VisitorCount:      52,
			VisitorPercentage: 26,
		},
		{
			UtmSource:         "linkedin",
			VisitorCount:      4,
			VisitorPercentage: 2,
		},
		{
			UtmSource:         "facebook",
			VisitorCount:      1,
			VisitorPercentage: 0,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
