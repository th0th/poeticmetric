package language

import (
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
)

var (
	dp *depot.Depot
)

func TestGet(t *testing.T) {
	start, err := time.Parse("2006-01-02", "2022-01-01")
	assert.NoError(t, err)

	end, err := time.Parse("2006-01-02", "2022-12-31")
	assert.NoError(t, err)

	modelSite := h.Site(dp, nil)

	testData := []*struct {
		Language     string
		VisitorCount int
	}{
		{Language: "English", VisitorCount: 652},
		{Language: "Turkish", VisitorCount: 292},
		{Language: "German", VisitorCount: 147},
		{Language: "French", VisitorCount: 144},
		{Language: "Spanish", VisitorCount: 128},
		{Language: "Hindi", VisitorCount: 116},
		{Language: "Portuguese", VisitorCount: 109},
		{Language: "Russian", VisitorCount: 107},
		{Language: "Japanese", VisitorCount: 104},
		{Language: "Korean", VisitorCount: 101},
		{Language: "Italian", VisitorCount: 100},
	}

	events := []*model.Event{}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				Kind:      model.EventKindPageView,
				Language:  &d.Language,
				SiteId:    modelSite.Id,
				VisitorId: uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &filter.Filters{
		End:    end,
		SiteId: modelSite.Id,
		Start:  start,
	}, nil)
	assert.NoError(t, err)

	// total is 2000
	expectedReport := &Report{
		Data: []*Datum{
			{Language: "English", VisitorCount: 652, VisitorPercentage: 33},
			{Language: "Turkish", VisitorCount: 292, VisitorPercentage: 15},
			{Language: "German", VisitorCount: 147, VisitorPercentage: 7},
			{Language: "French", VisitorCount: 144, VisitorPercentage: 7},
			{Language: "Spanish", VisitorCount: 128, VisitorPercentage: 6},
			{Language: "Hindi", VisitorCount: 116, VisitorPercentage: 6},
			{Language: "Portuguese", VisitorCount: 109, VisitorPercentage: 5},
			{Language: "Russian", VisitorCount: 107, VisitorPercentage: 5},
			{Language: "Japanese", VisitorCount: 104, VisitorPercentage: 5},
			{Language: "Korean", VisitorCount: 101, VisitorPercentage: 5},
		},
		PaginationCursor: &PaginationCursor{Language: "Korean", VisitorCount: 101},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
