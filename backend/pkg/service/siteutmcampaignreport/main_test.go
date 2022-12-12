package siteutmcampaignreport

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
		UtmCampaign  *string
		VisitorCount int
	}{
		{UtmCampaign: nil, VisitorCount: 237},
		{UtmCampaign: pointer.Get("moderator"), VisitorCount: 120},
		{UtmCampaign: pointer.Get("analyzing"), VisitorCount: 48},
		{UtmCampaign: pointer.Get("application"), VisitorCount: 23},
		{UtmCampaign: pointer.Get("monitoring"), VisitorCount: 9},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:    gofakeit.DateRange(start, end),
				Id:          uuid.NewString(),
				SiteId:      modelSite.Id,
				UtmCampaign: d.UtmCampaign,
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
			UtmCampaign:       "moderator",
			VisitorCount:      120,
			VisitorPercentage: 60,
		},
		{
			UtmCampaign:       "analyzing",
			VisitorCount:      48,
			VisitorPercentage: 24,
		},
		{
			UtmCampaign:       "application",
			VisitorCount:      23,
			VisitorPercentage: 12,
		},
		{
			UtmCampaign:       "monitoring",
			VisitorCount:      9,
			VisitorPercentage: 4,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
