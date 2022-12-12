package siteutmtermreport

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
		{UtmTerm: pointer.Get("helvetica"), VisitorCount: 122},
		{UtmTerm: pointer.Get("readymade"), VisitorCount: 105},
		{UtmTerm: pointer.Get("letterpress"), VisitorCount: 39},
		{UtmTerm: pointer.Get("keffiyeh"), VisitorCount: 34},
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
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{
			UtmTerm:           "helvetica",
			VisitorCount:      122,
			VisitorPercentage: 41,
		},
		{
			UtmTerm:           "readymade",
			VisitorCount:      105,
			VisitorPercentage: 35,
		},
		{
			UtmTerm:           "letterpress",
			VisitorCount:      39,
			VisitorPercentage: 13,
		},
		{
			UtmTerm:           "keffiyeh",
			VisitorCount:      34,
			VisitorPercentage: 11,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
