package referrerpath

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/poeticmetric/poeticmetric/backend/pkg/testhelper"
	"github.com/stretchr/testify/assert"
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

	referrerSite := "https://www.webgazer.io"

	testData := []*struct {
		ReferrerPath string
		VisitorCount int
	}{
		{ReferrerPath: "/analytics", VisitorCount: 997},
		{ReferrerPath: "/privacy-first", VisitorCount: 615},
		{ReferrerPath: "/awesome", VisitorCount: 169},
		{ReferrerPath: "/authority", VisitorCount: 155},
		{ReferrerPath: "/art.html", VisitorCount: 21},
		{ReferrerPath: "/birth", VisitorCount: 15},
		{ReferrerPath: "/branch", VisitorCount: 13},
		{ReferrerPath: "/badge", VisitorCount: 7},
		{ReferrerPath: "/acoustics", VisitorCount: 5},
		{ReferrerPath: "/blow.php", VisitorCount: 2},
		{ReferrerPath: "/brake.aspx", VisitorCount: 1},
	}

	events := []*model.Event{}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			events = append(events, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				Kind:      model.EventKindPageView,
				Referrer:  pointer.Get(fmt.Sprintf("%s%s", referrerSite, d.ReferrerPath)),
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
		End:          end,
		ReferrerSite: &referrerSite,
		SiteId:       modelSite.Id,
		Start:        start,
	}, nil)
	assert.NoError(t, err)

	expectedReport := &Report{
		Data: []*Datum{
			{Referrer: fmt.Sprintf("%s/analytics", referrerSite), ReferrerPath: "/analytics", VisitorCount: 997, VisitorPercentage: 50},
			{Referrer: fmt.Sprintf("%s/privacy-first", referrerSite), ReferrerPath: "/privacy-first", VisitorCount: 615, VisitorPercentage: 31},
			{Referrer: fmt.Sprintf("%s/awesome", referrerSite), ReferrerPath: "/awesome", VisitorCount: 169, VisitorPercentage: 8},
			{Referrer: fmt.Sprintf("%s/authority", referrerSite), ReferrerPath: "/authority", VisitorCount: 155, VisitorPercentage: 8},
			{Referrer: fmt.Sprintf("%s/art.html", referrerSite), ReferrerPath: "/art.html", VisitorCount: 21, VisitorPercentage: 1},
			{Referrer: fmt.Sprintf("%s/birth", referrerSite), ReferrerPath: "/birth", VisitorCount: 15, VisitorPercentage: 1},
			{Referrer: fmt.Sprintf("%s/branch", referrerSite), ReferrerPath: "/branch", VisitorCount: 13, VisitorPercentage: 1},
			{Referrer: fmt.Sprintf("%s/badge", referrerSite), ReferrerPath: "/badge", VisitorCount: 7, VisitorPercentage: 0},
			{Referrer: fmt.Sprintf("%s/acoustics", referrerSite), ReferrerPath: "/acoustics", VisitorCount: 5, VisitorPercentage: 0},
			{Referrer: fmt.Sprintf("%s/blow.php", referrerSite), ReferrerPath: "/blow.php", VisitorCount: 2, VisitorPercentage: 0},
		},
		PaginationCursor: &PaginationCursor{ReferrerPath: "/blow.php", VisitorCount: 2},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
