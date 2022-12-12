package sitebrowserversionreport

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

	browserName := "Chrome"

	testData := []struct {
		BrowserVersion *string
		VisitorCount   int
	}{
		{BrowserVersion: nil, VisitorCount: 237},
		{BrowserVersion: pointer.Get("107.0.5304"), VisitorCount: 140},
		{BrowserVersion: pointer.Get("106.0.5249"), VisitorCount: 44},
		{BrowserVersion: pointer.Get("105.0.5195"), VisitorCount: 10},
		{BrowserVersion: pointer.Get("104.0.5112"), VisitorCount: 4},
		{BrowserVersion: pointer.Get("103.0.5060"), VisitorCount: 2},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				BrowserName:    &browserName,
				BrowserVersion: d.BrowserVersion,
				DateTime:       gofakeit.DateRange(start, end),
				Id:             uuid.NewString(),
				SiteId:         modelSite.Id,
				VisitorId:      uuid.NewString(),
			})
		}
	}

	err = dp.ClickHouse().
		Create(&events).
		Error
	assert.NoError(t, err)

	report, err := Get(dp, &filter.Filters{
		BrowserName: &browserName,
		End:         end,
		SiteId:      modelSite.Id,
		Start:       start,
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{
			BrowserVersion:    "107.0.5304",
			VisitorCount:      140,
			VisitorPercentage: 70,
		},
		{
			BrowserVersion:    "106.0.5249",
			VisitorCount:      44,
			VisitorPercentage: 22,
		},
		{
			BrowserVersion:    "105.0.5195",
			VisitorCount:      10,
			VisitorPercentage: 5,
		},
		{
			BrowserVersion:    "104.0.5112",
			VisitorCount:      4,
			VisitorPercentage: 2,
		},
		{
			BrowserVersion:    "103.0.5060",
			VisitorCount:      2,
			VisitorPercentage: 1,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
