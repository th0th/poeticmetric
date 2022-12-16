package browserversion

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
		{BrowserVersion: pointer.Get("11"), VisitorCount: 287},
		{BrowserVersion: pointer.Get("10"), VisitorCount: 280},
		{BrowserVersion: pointer.Get("9"), VisitorCount: 274},
		{BrowserVersion: pointer.Get("8"), VisitorCount: 271},
		{BrowserVersion: pointer.Get("7"), VisitorCount: 263},
		{BrowserVersion: pointer.Get("6"), VisitorCount: 250},
		{BrowserVersion: pointer.Get("5"), VisitorCount: 150},
		{BrowserVersion: pointer.Get("4"), VisitorCount: 141},
		{BrowserVersion: pointer.Get("3"), VisitorCount: 45},
		{BrowserVersion: pointer.Get("2"), VisitorCount: 21},
		{BrowserVersion: pointer.Get("1"), VisitorCount: 18},
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
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{BrowserName: "Chrome", BrowserVersion: "11", VisitorCount: 287, VisitorPercentage: 14},
			{BrowserName: "Chrome", BrowserVersion: "10", VisitorCount: 280, VisitorPercentage: 14},
			{BrowserName: "Chrome", BrowserVersion: "9", VisitorCount: 274, VisitorPercentage: 14},
			{BrowserName: "Chrome", BrowserVersion: "8", VisitorCount: 271, VisitorPercentage: 14},
			{BrowserName: "Chrome", BrowserVersion: "7", VisitorCount: 263, VisitorPercentage: 13},
			{BrowserName: "Chrome", BrowserVersion: "6", VisitorCount: 250, VisitorPercentage: 12},
			{BrowserName: "Chrome", BrowserVersion: "5", VisitorCount: 150, VisitorPercentage: 8},
			{BrowserName: "Chrome", BrowserVersion: "4", VisitorCount: 141, VisitorPercentage: 7},
			{BrowserName: "Chrome", BrowserVersion: "3", VisitorCount: 45, VisitorPercentage: 2},
			{BrowserName: "Chrome", BrowserVersion: "2", VisitorCount: 21, VisitorPercentage: 1},
		},
		PaginationCursor: &PaginationCursor{BrowserVersion: "2", VisitorCount: 21},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
