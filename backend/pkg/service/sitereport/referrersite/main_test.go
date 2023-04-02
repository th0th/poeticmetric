package referrersite

import (
	"fmt"
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
	start, err := time.Parse("2006-01-02", "2022-01-01")
	assert.NoError(t, err)

	end, err := time.Parse("2006-01-02", "2022-12-31")
	assert.NoError(t, err)

	modelSite := h.Site(dp, nil)

	testData := []*struct {
		ReferrerSite string
		VisitorCount int
	}{
		{ReferrerSite: "https://www.webgazer.io", VisitorCount: 820},
		{ReferrerSite: "https://www.google.com", VisitorCount: 440},
		{ReferrerSite: "https://www.bing.com", VisitorCount: 306},
		{ReferrerSite: "https://www.yahoo.com", VisitorCount: 236},
		{ReferrerSite: "https://www.twitter.com", VisitorCount: 129},
		{ReferrerSite: "https://www.github.com", VisitorCount: 27},
		{ReferrerSite: "https://www.facebook.com", VisitorCount: 16},
		{ReferrerSite: "https://www.instagram.com", VisitorCount: 12},
		{ReferrerSite: "https://www.reddit.com", VisitorCount: 9},
		{ReferrerSite: "https://www.producthunt.com", VisitorCount: 4},
		{ReferrerSite: "https://news.ycombinator.com", VisitorCount: 1},
	}

	events := []*model.Event{}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				Kind:      model.EventKindPageView,
				Referrer:  pointer.Get(fmt.Sprintf("%s%s", d.ReferrerSite, h.GetRandomUrlPath())),
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

	expectedReport := &Report{
		Data: []*Datum{
			{Domain: "www.webgazer.io", ReferrerSite: "https://www.webgazer.io", VisitorCount: 820, VisitorPercentage: 41},
			{Domain: "www.google.com", ReferrerSite: "https://www.google.com", VisitorCount: 440, VisitorPercentage: 22},
			{Domain: "www.bing.com", ReferrerSite: "https://www.bing.com", VisitorCount: 306, VisitorPercentage: 15},
			{Domain: "www.yahoo.com", ReferrerSite: "https://www.yahoo.com", VisitorCount: 236, VisitorPercentage: 12},
			{Domain: "www.twitter.com", ReferrerSite: "https://www.twitter.com", VisitorCount: 129, VisitorPercentage: 6},
			{Domain: "www.github.com", ReferrerSite: "https://www.github.com", VisitorCount: 27, VisitorPercentage: 1},
			{Domain: "www.facebook.com", ReferrerSite: "https://www.facebook.com", VisitorCount: 16, VisitorPercentage: 1},
			{Domain: "www.instagram.com", ReferrerSite: "https://www.instagram.com", VisitorCount: 12, VisitorPercentage: 1},
			{Domain: "www.reddit.com", ReferrerSite: "https://www.reddit.com", VisitorCount: 9, VisitorPercentage: 0},
			{Domain: "www.producthunt.com", ReferrerSite: "https://www.producthunt.com", VisitorCount: 4, VisitorPercentage: 0},
		},
		PaginationCursor: &PaginationCursor{ReferrerSite: "https://www.producthunt.com", VisitorCount: 4},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
