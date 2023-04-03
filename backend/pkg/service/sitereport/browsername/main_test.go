package browsername

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
		BrowserName  *string
		VisitorCount int
	}{
		{BrowserName: nil, VisitorCount: 237},
		{BrowserName: pointer.Get("Chrome"), VisitorCount: 306},
		{BrowserName: pointer.Get("Firefox"), VisitorCount: 294},
		{BrowserName: pointer.Get("Safari"), VisitorCount: 261},
		{BrowserName: pointer.Get("Edge"), VisitorCount: 252},
		{BrowserName: pointer.Get("Chromium"), VisitorCount: 245},
		{BrowserName: pointer.Get("Brave"), VisitorCount: 214},
		{BrowserName: pointer.Get("Icecat"), VisitorCount: 161},
		{BrowserName: pointer.Get("Iceweasel"), VisitorCount: 126},
		{BrowserName: pointer.Get("Opera"), VisitorCount: 92},
		{BrowserName: pointer.Get("Konqueror"), VisitorCount: 43},
		{BrowserName: pointer.Get("Elinks"), VisitorCount: 6},
	}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				BrowserName: d.BrowserName,
				DateTime:    gofakeit.DateRange(start, end),
				Id:          uuid.NewString(),
				SiteId:      modelSite.Id,
				VisitorId:   uuid.NewString(),
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
			{BrowserName: "Chrome", VisitorCount: 306, VisitorPercentage: 15},
			{BrowserName: "Firefox", VisitorCount: 294, VisitorPercentage: 15},
			{BrowserName: "Safari", VisitorCount: 261, VisitorPercentage: 13},
			{BrowserName: "Edge", VisitorCount: 252, VisitorPercentage: 13},
			{BrowserName: "Chromium", VisitorCount: 245, VisitorPercentage: 12},
			{BrowserName: "Brave", VisitorCount: 214, VisitorPercentage: 11},
			{BrowserName: "Icecat", VisitorCount: 161, VisitorPercentage: 8},
			{BrowserName: "Iceweasel", VisitorCount: 126, VisitorPercentage: 6},
			{BrowserName: "Opera", VisitorCount: 92, VisitorPercentage: 5},
			{BrowserName: "Konqueror", VisitorCount: 43, VisitorPercentage: 2},
		},
		PaginationCursor: &PaginationCursor{
			BrowserName:  "Konqueror",
			VisitorCount: 43,
		},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
