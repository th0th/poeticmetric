package pathvisitor

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/pagination"
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
		Url          string
		VisitorCount int
	}{
		{Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain), VisitorCount: 34},
		{Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain), VisitorCount: 143},
		{Url: fmt.Sprintf("https://%s/path-3", modelSite.Domain), VisitorCount: 239},
		{Url: fmt.Sprintf("https://%s/path-4", modelSite.Domain), VisitorCount: 291},
		{Url: fmt.Sprintf("https://%s/path-5", modelSite.Domain), VisitorCount: 293},
	}

	events := []*model.Event{}

	for _, d := range testData {
		for i := 0; i < d.VisitorCount; i += 1 {
			event := &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Id:        uuid.NewString(),
				SiteId:    modelSite.Id,
				VisitorId: uuid.NewString(),
			}

			event.FillFromUrl(d.Url)

			events = append(events, event)
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
			{Path: "/path-5", Url: fmt.Sprintf("https://%s/path-5", modelSite.Domain), VisitorCount: 293, VisitorPercentage: 29.3},
			{Path: "/path-4", Url: fmt.Sprintf("https://%s/path-4", modelSite.Domain), VisitorCount: 291, VisitorPercentage: 29.1},
			{Path: "/path-3", Url: fmt.Sprintf("https://%s/path-3", modelSite.Domain), VisitorCount: 239, VisitorPercentage: 23.9},
			{Path: "/path-2", Url: fmt.Sprintf("https://%s/path-2", modelSite.Domain), VisitorCount: 143, VisitorPercentage: 14.3},
			{Path: "/path-1", Url: fmt.Sprintf("https://%s/path-1", modelSite.Domain), VisitorCount: 34, VisitorPercentage: 3.4},
		},
	}

	expectedReport.PaginationCursor = pagination.GetPaginationCursor[PaginationCursor](expectedReport.Data)

	assert.Equal(t, expectedReport, report)
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
