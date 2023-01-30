package utmcampaign

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

	events := []*model.Event{}

	testData := []struct {
		UtmCampaign  *string
		VisitorCount int
	}{
		{UtmCampaign: nil, VisitorCount: 237},
		{UtmCampaign: pointer.Get("utmCampaign#1"), VisitorCount: 331},
		{UtmCampaign: pointer.Get("utmCampaign#2"), VisitorCount: 316},
		{UtmCampaign: pointer.Get("utmCampaign#3"), VisitorCount: 309},
		{UtmCampaign: pointer.Get("utmCampaign#4"), VisitorCount: 235},
		{UtmCampaign: pointer.Get("utmCampaign#5"), VisitorCount: 224},
		{UtmCampaign: pointer.Get("utmCampaign#6"), VisitorCount: 168},
		{UtmCampaign: pointer.Get("utmCampaign#7"), VisitorCount: 168},
		{UtmCampaign: pointer.Get("utmCampaign#8"), VisitorCount: 128},
		{UtmCampaign: pointer.Get("utmCampaign#9"), VisitorCount: 68},
		{UtmCampaign: pointer.Get("utmCampaign#10"), VisitorCount: 29},
		{UtmCampaign: pointer.Get("utmCampaign#11"), VisitorCount: 24},
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
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{UtmCampaign: "utmCampaign#1", VisitorCount: 331, VisitorPercentage: 17},
			{UtmCampaign: "utmCampaign#2", VisitorCount: 316, VisitorPercentage: 16},
			{UtmCampaign: "utmCampaign#3", VisitorCount: 309, VisitorPercentage: 15},
			{UtmCampaign: "utmCampaign#4", VisitorCount: 235, VisitorPercentage: 12},
			{UtmCampaign: "utmCampaign#5", VisitorCount: 224, VisitorPercentage: 11},
			{UtmCampaign: "utmCampaign#6", VisitorCount: 168, VisitorPercentage: 8},
			{UtmCampaign: "utmCampaign#7", VisitorCount: 168, VisitorPercentage: 8},
			{UtmCampaign: "utmCampaign#8", VisitorCount: 128, VisitorPercentage: 6},
			{UtmCampaign: "utmCampaign#9", VisitorCount: 68, VisitorPercentage: 3},
			{UtmCampaign: "utmCampaign#10", VisitorCount: 29, VisitorPercentage: 1},
		},
		PaginationCursor: &PaginationCursor{UtmCampaign: "utmCampaign#10", VisitorCount: 29},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
