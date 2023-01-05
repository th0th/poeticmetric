package sitepathdurationreport

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
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

	testData := []struct {
		Duration uint32
		Url      string
	}{
		// path-1
		{Duration: 10, Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},
		{Duration: 60, Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},
		{Duration: 128, Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},
		{Duration: 6165, Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},
		{Duration: 0, Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},

		// path-2
		{Duration: 276, Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
		{Duration: 31, Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
		{Duration: 1, Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
		{Duration: 123, Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
		{Duration: 97, Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
	}

	events := []*model.Event{}

	for _, d := range testData {
		event := &model.Event{
			DateTime:  gofakeit.DateRange(start, end),
			Duration:  d.Duration,
			Id:        uuid.NewString(),
			SiteId:    modelSite.Id,
			VisitorId: uuid.NewString(),
		}

		event.FillFromUrl(d.Url, nil)

		events = append(events, event)
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
		{AverageDuration: 1591, Path: "/path-1", Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain)},
		{AverageDuration: 106, Path: "/path-2", Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain)},
	}

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
