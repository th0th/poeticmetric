package sitelanguagereport

import (
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereportfilters"
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
	start, err := time.Parse("2006-01-02", "2022-01-01")
	assert.NoError(t, err)

	end, err := time.Parse("2006-01-02", "2022-12-31")
	assert.NoError(t, err)

	modelSite := h.Site(dp, nil)

	testData := []*struct {
		Language     string
		VisitorCount int
	}{
		{Language: "English", VisitorCount: 159},
		{Language: "Turkish", VisitorCount: 18},
		{Language: "German", VisitorCount: 14},
		{Language: "French", VisitorCount: 9},
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

	report, err := Get(dp, &sitereportfilters.Filters{
		End:    end,
		SiteId: modelSite.Id,
		Start:  start,
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{Language: "English", VisitorCount: 159, VisitorPercentage: 80},
		{Language: "Turkish", VisitorCount: 18, VisitorPercentage: 9},
		{Language: "German", VisitorCount: 14, VisitorPercentage: 7},
		{Language: "French", VisitorCount: 9, VisitorPercentage: 4},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
