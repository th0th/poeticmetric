package timetrends

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
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

	timeZones := []string{
		"America/New_York",
		"Europe/Berlin",
		"Europe/Istanbul",
		"UTC",
	}

	data := []struct {
		DateTimeString string
		VisitorId      string
	}{
		// day: 1, hour: 0
		{DateTimeString: "2022-11-21 00:00", VisitorId: "1"},
		{DateTimeString: "2022-11-21 00:01", VisitorId: "1"},
		{DateTimeString: "2022-11-21 00:02", VisitorId: "2"},
		{DateTimeString: "2022-11-21 00:03", VisitorId: "2"},
		{DateTimeString: "2022-11-21 01:59", VisitorId: "3"},

		// day: 2, hour: 12
		{DateTimeString: "2022-11-22 12:00", VisitorId: "1"},
		{DateTimeString: "2022-11-22 12:01", VisitorId: "2"},
		{DateTimeString: "2022-11-22 12:59", VisitorId: "3"},
		{DateTimeString: "2022-11-22 13:30", VisitorId: "4"},
		{DateTimeString: "2022-11-22 13:59", VisitorId: "5"},
	}

	for _, timeZone := range timeZones {
		modelSite := h.Site(dp, nil)

		var loc *time.Location

		loc, err = time.LoadLocation(timeZone)
		if err != nil {
			panic(err)
		}

		events := []*model.Event{}

		for _, d := range data {
			var dateTime time.Time

			dateTime, err = time.Parse("2006-01-02 15:04", d.DateTimeString)
			if err != nil {
				panic(err)
			}

			dateTime = time.Date(
				dateTime.Year(),
				dateTime.Month(),
				dateTime.Day(),
				dateTime.Hour(),
				dateTime.Minute(),
				dateTime.Second(),
				dateTime.Nanosecond(),
				loc,
			)

			events = append(events, &model.Event{
				DateTime:  dateTime,
				Id:        uuid.NewString(),
				Kind:      model.EventKindPageView,
				SiteId:    modelSite.Id,
				VisitorId: d.VisitorId,
			})
		}

		err = dp.ClickHouse().
			Create(&events).
			Error
		assert.NoError(t, err)

		var report Report

		report, err = Get(dp, &filter.Filters{
			End:      end,
			SiteId:   modelSite.Id,
			Start:    start,
			TimeZone: &timeZone,
		})
		assert.NoError(t, err)

		expectedReport := Report{
			{Day: 1, Hour: 0, VisitorCount: 3},
			{Day: 1, Hour: 2, VisitorCount: 0},
			{Day: 1, Hour: 4, VisitorCount: 0},
			{Day: 1, Hour: 6, VisitorCount: 0},
			{Day: 1, Hour: 8, VisitorCount: 0},
			{Day: 1, Hour: 10, VisitorCount: 0},
			{Day: 1, Hour: 12, VisitorCount: 0},
			{Day: 1, Hour: 14, VisitorCount: 0},
			{Day: 1, Hour: 16, VisitorCount: 0},
			{Day: 1, Hour: 18, VisitorCount: 0},
			{Day: 1, Hour: 20, VisitorCount: 0},
			{Day: 1, Hour: 22, VisitorCount: 0},
			{Day: 2, Hour: 0, VisitorCount: 0},
			{Day: 2, Hour: 2, VisitorCount: 0},
			{Day: 2, Hour: 4, VisitorCount: 0},
			{Day: 2, Hour: 6, VisitorCount: 0},
			{Day: 2, Hour: 8, VisitorCount: 0},
			{Day: 2, Hour: 10, VisitorCount: 0},
			{Day: 2, Hour: 12, VisitorCount: 5},
			{Day: 2, Hour: 14, VisitorCount: 0},
			{Day: 2, Hour: 16, VisitorCount: 0},
			{Day: 2, Hour: 18, VisitorCount: 0},
			{Day: 2, Hour: 20, VisitorCount: 0},
			{Day: 2, Hour: 22, VisitorCount: 0},
			{Day: 3, Hour: 0, VisitorCount: 0},
			{Day: 3, Hour: 2, VisitorCount: 0},
			{Day: 3, Hour: 4, VisitorCount: 0},
			{Day: 3, Hour: 6, VisitorCount: 0},
			{Day: 3, Hour: 8, VisitorCount: 0},
			{Day: 3, Hour: 10, VisitorCount: 0},
			{Day: 3, Hour: 12, VisitorCount: 0},
			{Day: 3, Hour: 14, VisitorCount: 0},
			{Day: 3, Hour: 16, VisitorCount: 0},
			{Day: 3, Hour: 18, VisitorCount: 0},
			{Day: 3, Hour: 20, VisitorCount: 0},
			{Day: 3, Hour: 22, VisitorCount: 0},
			{Day: 4, Hour: 0, VisitorCount: 0},
			{Day: 4, Hour: 2, VisitorCount: 0},
			{Day: 4, Hour: 4, VisitorCount: 0},
			{Day: 4, Hour: 6, VisitorCount: 0},
			{Day: 4, Hour: 8, VisitorCount: 0},
			{Day: 4, Hour: 10, VisitorCount: 0},
			{Day: 4, Hour: 12, VisitorCount: 0},
			{Day: 4, Hour: 14, VisitorCount: 0},
			{Day: 4, Hour: 16, VisitorCount: 0},
			{Day: 4, Hour: 18, VisitorCount: 0},
			{Day: 4, Hour: 20, VisitorCount: 0},
			{Day: 4, Hour: 22, VisitorCount: 0},
			{Day: 5, Hour: 0, VisitorCount: 0},
			{Day: 5, Hour: 2, VisitorCount: 0},
			{Day: 5, Hour: 4, VisitorCount: 0},
			{Day: 5, Hour: 6, VisitorCount: 0},
			{Day: 5, Hour: 8, VisitorCount: 0},
			{Day: 5, Hour: 10, VisitorCount: 0},
			{Day: 5, Hour: 12, VisitorCount: 0},
			{Day: 5, Hour: 14, VisitorCount: 0},
			{Day: 5, Hour: 16, VisitorCount: 0},
			{Day: 5, Hour: 18, VisitorCount: 0},
			{Day: 5, Hour: 20, VisitorCount: 0},
			{Day: 5, Hour: 22, VisitorCount: 0},
			{Day: 6, Hour: 0, VisitorCount: 0},
			{Day: 6, Hour: 2, VisitorCount: 0},
			{Day: 6, Hour: 4, VisitorCount: 0},
			{Day: 6, Hour: 6, VisitorCount: 0},
			{Day: 6, Hour: 8, VisitorCount: 0},
			{Day: 6, Hour: 10, VisitorCount: 0},
			{Day: 6, Hour: 12, VisitorCount: 0},
			{Day: 6, Hour: 14, VisitorCount: 0},
			{Day: 6, Hour: 16, VisitorCount: 0},
			{Day: 6, Hour: 18, VisitorCount: 0},
			{Day: 6, Hour: 20, VisitorCount: 0},
			{Day: 6, Hour: 22, VisitorCount: 0},
			{Day: 7, Hour: 0, VisitorCount: 0},
			{Day: 7, Hour: 2, VisitorCount: 0},
			{Day: 7, Hour: 4, VisitorCount: 0},
			{Day: 7, Hour: 6, VisitorCount: 0},
			{Day: 7, Hour: 8, VisitorCount: 0},
			{Day: 7, Hour: 10, VisitorCount: 0},
			{Day: 7, Hour: 12, VisitorCount: 0},
			{Day: 7, Hour: 14, VisitorCount: 0},
			{Day: 7, Hour: 16, VisitorCount: 0},
			{Day: 7, Hour: 18, VisitorCount: 0},
			{Day: 7, Hour: 20, VisitorCount: 0},
			{Day: 7, Hour: 22, VisitorCount: 0},
		}

		for i := range expectedReport {
			assert.Equal(
				t,
				expectedReport[i],
				report[i],
				fmt.Sprintf("Time zone: %s, Day: %d, Hour: %d", timeZone, expectedReport[i].Day, expectedReport[i].Hour),
			)
		}
	}
}

func TestMain(m *testing.M) {
	dp = h.NewDepot()

	os.Exit(m.Run())
}
