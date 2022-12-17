package utmterm

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
		UtmTerm      *string
		VisitorCount int
	}{
		{UtmTerm: nil, VisitorCount: 237},
		{UtmTerm: pointer.Get("utmTerm#1"), VisitorCount: 331},
		{UtmTerm: pointer.Get("utmTerm#2"), VisitorCount: 316},
		{UtmTerm: pointer.Get("utmTerm#3"), VisitorCount: 309},
		{UtmTerm: pointer.Get("utmTerm#4"), VisitorCount: 235},
		{UtmTerm: pointer.Get("utmTerm#5"), VisitorCount: 224},
		{UtmTerm: pointer.Get("utmTerm#6"), VisitorCount: 168},
		{UtmTerm: pointer.Get("utmTerm#7"), VisitorCount: 168},
		{UtmTerm: pointer.Get("utmTerm#8"), VisitorCount: 128},
		{UtmTerm: pointer.Get("utmTerm#9"), VisitorCount: 68},
		{UtmTerm: pointer.Get("utmTerm#10"), VisitorCount: 29},
		{UtmTerm: pointer.Get("utmTerm#11"), VisitorCount: 24},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				SiteId:    modelSite.Id,
				UtmTerm:   d.UtmTerm,
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
			{UtmTerm: "utmTerm#1", VisitorCount: 331, VisitorPercentage: 17},
			{UtmTerm: "utmTerm#2", VisitorCount: 316, VisitorPercentage: 16},
			{UtmTerm: "utmTerm#3", VisitorCount: 309, VisitorPercentage: 15},
			{UtmTerm: "utmTerm#4", VisitorCount: 235, VisitorPercentage: 12},
			{UtmTerm: "utmTerm#5", VisitorCount: 224, VisitorPercentage: 11},
			{UtmTerm: "utmTerm#6", VisitorCount: 168, VisitorPercentage: 8},
			{UtmTerm: "utmTerm#7", VisitorCount: 168, VisitorPercentage: 8},
			{UtmTerm: "utmTerm#8", VisitorCount: 128, VisitorPercentage: 6},
			{UtmTerm: "utmTerm#9", VisitorCount: 68, VisitorPercentage: 3},
			{UtmTerm: "utmTerm#10", VisitorCount: 29, VisitorPercentage: 1},
		},
		PaginationCursor: &PaginationCursor{UtmTerm: "utmTerm#10", VisitorCount: 29},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
