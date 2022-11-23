package siteutmcontentreport

import (
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
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
		{UtmContent: pointer.Get("intangible"), VisitorCount: 164},
		{UtmContent: pointer.Get("background"), VisitorCount: 86},
		{UtmContent: pointer.Get("array"), VisitorCount: 31},
		{UtmContent: pointer.Get("interactive"), VisitorCount: 19},
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

	report, err := Get(dp, &sitereportfilters.Filters{
		End:    end,
		SiteId: modelSite.Id,
		Start:  start,
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{
			UtmContent:        "intangible",
			VisitorCount:      164,
			VisitorPercentage: 55,
		},
		{
			UtmContent:        "background",
			VisitorCount:      86,
			VisitorPercentage: 29,
		},
		{
			UtmContent:        "array",
			VisitorCount:      31,
			VisitorPercentage: 10,
		},
		{
			UtmContent:        "interactive",
			VisitorCount:      19,
			VisitorPercentage: 6,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
