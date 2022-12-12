package siteutmmediumreport

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
		UtmMedium    *string
		VisitorCount int
	}{
		{UtmMedium: nil, VisitorCount: 237},
		{UtmMedium: pointer.Get("encompassing"), VisitorCount: 79},
		{UtmMedium: pointer.Get("holistic"), VisitorCount: 64},
		{UtmMedium: pointer.Get("mobile"), VisitorCount: 53},
		{UtmMedium: pointer.Get("programmable"), VisitorCount: 4},
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
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{
			UtmMedium:         "encompassing",
			VisitorCount:      79,
			VisitorPercentage: 40,
		},
		{
			UtmMedium:         "holistic",
			VisitorCount:      64,
			VisitorPercentage: 32,
		},
		{
			UtmMedium:         "mobile",
			VisitorCount:      53,
			VisitorPercentage: 26,
		},
		{
			UtmMedium:         "programmable",
			VisitorCount:      4,
			VisitorPercentage: 2,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
