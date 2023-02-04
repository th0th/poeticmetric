package utmsource

import (
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/pointer"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
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
		{UtmSource: pointer.Get("utmsource1"), VisitorCount: 297},
		{UtmSource: pointer.Get("utmsource2"), VisitorCount: 275},
		{UtmSource: pointer.Get("utmsource3"), VisitorCount: 236},
		{UtmSource: pointer.Get("utmsource4"), VisitorCount: 200},
		{UtmSource: pointer.Get("utmsource5"), VisitorCount: 200},
		{UtmSource: pointer.Get("utmsource6"), VisitorCount: 199},
		{UtmSource: pointer.Get("utmsource7"), VisitorCount: 193},
		{UtmSource: pointer.Get("utmsource8"), VisitorCount: 145},
		{UtmSource: pointer.Get("utmsource9"), VisitorCount: 115},
		{UtmSource: pointer.Get("utmsource10"), VisitorCount: 75},
		{UtmSource: pointer.Get("utmsource11"), VisitorCount: 65},
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
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{UtmSource: "utmsource1", VisitorCount: 297, VisitorPercentage: 15},
			{UtmSource: "utmsource2", VisitorCount: 275, VisitorPercentage: 14},
			{UtmSource: "utmsource3", VisitorCount: 236, VisitorPercentage: 12},
			{UtmSource: "utmsource4", VisitorCount: 200, VisitorPercentage: 10},
			{UtmSource: "utmsource5", VisitorCount: 200, VisitorPercentage: 10},
			{UtmSource: "utmsource6", VisitorCount: 199, VisitorPercentage: 10},
			{UtmSource: "utmsource7", VisitorCount: 193, VisitorPercentage: 10},
			{UtmSource: "utmsource8", VisitorCount: 145, VisitorPercentage: 7},
			{UtmSource: "utmsource9", VisitorCount: 115, VisitorPercentage: 6},
			{UtmSource: "utmsource10", VisitorCount: 75, VisitorPercentage: 4},
		},
		PaginationCursor: &PaginationCursor{UtmSource: "utmsource10", VisitorCount: 75},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
