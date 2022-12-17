package utmcontent

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
		UtmContent   *string
		VisitorCount int
	}{
		{UtmContent: nil, VisitorCount: 237},
		{UtmContent: pointer.Get("utmContent#1"), VisitorCount: 331},
		{UtmContent: pointer.Get("utmContent#2"), VisitorCount: 316},
		{UtmContent: pointer.Get("utmContent#3"), VisitorCount: 309},
		{UtmContent: pointer.Get("utmContent#4"), VisitorCount: 235},
		{UtmContent: pointer.Get("utmContent#5"), VisitorCount: 224},
		{UtmContent: pointer.Get("utmContent#6"), VisitorCount: 168},
		{UtmContent: pointer.Get("utmContent#7"), VisitorCount: 168},
		{UtmContent: pointer.Get("utmContent#8"), VisitorCount: 128},
		{UtmContent: pointer.Get("utmContent#9"), VisitorCount: 68},
		{UtmContent: pointer.Get("utmContent#10"), VisitorCount: 29},
		{UtmContent: pointer.Get("utmContent#11"), VisitorCount: 24},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:   gofakeit.DateRange(start, end),
				Id:         uuid.NewString(),
				SiteId:     modelSite.Id,
				UtmContent: d.UtmContent,
				VisitorId:  uuid.NewString(),
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
			{UtmContent: "utmContent#1", VisitorCount: 331, VisitorPercentage: 17},
			{UtmContent: "utmContent#2", VisitorCount: 316, VisitorPercentage: 16},
			{UtmContent: "utmContent#3", VisitorCount: 309, VisitorPercentage: 15},
			{UtmContent: "utmContent#4", VisitorCount: 235, VisitorPercentage: 12},
			{UtmContent: "utmContent#5", VisitorCount: 224, VisitorPercentage: 11},
			{UtmContent: "utmContent#6", VisitorCount: 168, VisitorPercentage: 8},
			{UtmContent: "utmContent#7", VisitorCount: 168, VisitorPercentage: 8},
			{UtmContent: "utmContent#8", VisitorCount: 128, VisitorPercentage: 6},
			{UtmContent: "utmContent#9", VisitorCount: 68, VisitorPercentage: 3},
			{UtmContent: "utmContent#10", VisitorCount: 29, VisitorPercentage: 1},
		},
		PaginationCursor: &PaginationCursor{UtmContent: "utmContent#10", VisitorCount: 29},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
