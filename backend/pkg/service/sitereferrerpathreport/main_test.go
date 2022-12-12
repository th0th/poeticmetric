package sitereferrerpathreport

import (
	"fmt"
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
		{ReferrerPath: "/analytics", VisitorCount: 159},
		{ReferrerPath: "/privacy-first", VisitorCount: 18},
		{ReferrerPath: "/awesome", VisitorCount: 14},
		{ReferrerPath: "/yeah", VisitorCount: 9},
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
	})
	assert.NoError(t, err)

	expectedReport := Report{
		{Referrer: "https://www.webgazer.io/analytics", ReferrerPath: "/analytics", VisitorCount: 159, VisitorPercentage: 80},
		{Referrer: "https://www.webgazer.io/privacy-first", ReferrerPath: "/privacy-first", VisitorCount: 18, VisitorPercentage: 9},
		{Referrer: "https://www.webgazer.io/awesome", ReferrerPath: "/awesome", VisitorCount: 14, VisitorPercentage: 7},
		{Referrer: "https://www.webgazer.io/yeah", ReferrerPath: "/yeah", VisitorCount: 9, VisitorPercentage: 4},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
