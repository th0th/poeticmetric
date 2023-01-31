package utmmedium

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
		UtmMedium    *string
		VisitorCount int
	}{
		{UtmMedium: nil, VisitorCount: 237},
		{UtmMedium: pointer.Get("utmMedium#1"), VisitorCount: 331},
		{UtmMedium: pointer.Get("utmMedium#2"), VisitorCount: 316},
		{UtmMedium: pointer.Get("utmMedium#3"), VisitorCount: 309},
		{UtmMedium: pointer.Get("utmMedium#4"), VisitorCount: 235},
		{UtmMedium: pointer.Get("utmMedium#5"), VisitorCount: 224},
		{UtmMedium: pointer.Get("utmMedium#6"), VisitorCount: 168},
		{UtmMedium: pointer.Get("utmMedium#7"), VisitorCount: 168},
		{UtmMedium: pointer.Get("utmMedium#8"), VisitorCount: 128},
		{UtmMedium: pointer.Get("utmMedium#9"), VisitorCount: 68},
		{UtmMedium: pointer.Get("utmMedium#10"), VisitorCount: 29},
		{UtmMedium: pointer.Get("utmMedium#11"), VisitorCount: 24},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				SiteId:    modelSite.Id,
				UtmMedium: d.UtmMedium,
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
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{UtmMedium: "utmMedium#1", VisitorCount: 331, VisitorPercentage: 17},
			{UtmMedium: "utmMedium#2", VisitorCount: 316, VisitorPercentage: 16},
			{UtmMedium: "utmMedium#3", VisitorCount: 309, VisitorPercentage: 15},
			{UtmMedium: "utmMedium#4", VisitorCount: 235, VisitorPercentage: 12},
			{UtmMedium: "utmMedium#5", VisitorCount: 224, VisitorPercentage: 11},
			{UtmMedium: "utmMedium#6", VisitorCount: 168, VisitorPercentage: 8},
			{UtmMedium: "utmMedium#7", VisitorCount: 168, VisitorPercentage: 8},
			{UtmMedium: "utmMedium#8", VisitorCount: 128, VisitorPercentage: 6},
			{UtmMedium: "utmMedium#9", VisitorCount: 68, VisitorPercentage: 3},
			{UtmMedium: "utmMedium#10", VisitorCount: 29, VisitorPercentage: 1},
		},
		PaginationCursor: &PaginationCursor{UtmMedium: "utmMedium#10", VisitorCount: 29},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
