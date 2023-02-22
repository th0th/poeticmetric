package pageviewtrends

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

	pageViewTimeStrings := []string{
		// day: 1, hour: 0
		"2022-11-21 00:00",
		"2022-11-21 00:01",
		"2022-11-21 00:02",
		"2022-11-21 00:03",
		"2022-11-21 01:59",

		// day: 2, hour: 4
		"2022-11-22 04:00",
		"2022-11-22 04:32",
		"2022-11-22 05:00",
		"2022-11-22 04:59",

		// day: 3, hour: 14
		"2022-11-23 14:00",
		"2022-11-23 15:59",

		// day: 4, hour: 8
		"2022-11-24 08:00",
		"2022-11-24 08:01",
		"2022-11-24 08:02",
		"2022-11-24 08:03",
		"2022-11-24 08:04",
		"2022-11-24 09:56",
		"2022-11-24 09:57",
		"2022-11-24 09:58",
		"2022-11-24 09:59",

		// day: 7, hour: 22
		"2022-11-27 22:00",
		"2022-11-27 22:14",
		"2022-11-27 22:59",
		"2022-11-27 23:01",
		"2022-11-27 23:30",
		"2022-11-27 23:59",
	}

	for _, timeZone := range timeZones {
		modelSite := h.Site(dp, nil)

		var loc *time.Location

		loc, err = time.LoadLocation(timeZone)
		if err != nil {
			panic(err)
		}

		events := []*model.Event{}

		for _, s := range pageViewTimeStrings {
			var dateTime time.Time

			dateTime, err = time.Parse("2006-01-02 15:04", s)
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
				VisitorId: "1",
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
			{Day: 1, Hour: 0, PageViewCount: 5},
			{Day: 1, Hour: 2, PageViewCount: 0},
			{Day: 1, Hour: 4, PageViewCount: 0},
			{Day: 1, Hour: 6, PageViewCount: 0},
			{Day: 1, Hour: 8, PageViewCount: 0},
			{Day: 1, Hour: 10, PageViewCount: 0},
			{Day: 1, Hour: 12, PageViewCount: 0},
			{Day: 1, Hour: 14, PageViewCount: 0},
			{Day: 1, Hour: 16, PageViewCount: 0},
			{Day: 1, Hour: 18, PageViewCount: 0},
			{Day: 1, Hour: 20, PageViewCount: 0},
			{Day: 1, Hour: 22, PageViewCount: 0},
			{Day: 2, Hour: 0, PageViewCount: 0},
			{Day: 2, Hour: 2, PageViewCount: 0},
			{Day: 2, Hour: 4, PageViewCount: 4},
			{Day: 2, Hour: 6, PageViewCount: 0},
			{Day: 2, Hour: 8, PageViewCount: 0},
			{Day: 2, Hour: 10, PageViewCount: 0},
			{Day: 2, Hour: 12, PageViewCount: 0},
			{Day: 2, Hour: 14, PageViewCount: 0},
			{Day: 2, Hour: 16, PageViewCount: 0},
			{Day: 2, Hour: 18, PageViewCount: 0},
			{Day: 2, Hour: 20, PageViewCount: 0},
			{Day: 2, Hour: 22, PageViewCount: 0},
			{Day: 3, Hour: 0, PageViewCount: 0},
			{Day: 3, Hour: 2, PageViewCount: 0},
			{Day: 3, Hour: 4, PageViewCount: 0},
			{Day: 3, Hour: 6, PageViewCount: 0},
			{Day: 3, Hour: 8, PageViewCount: 0},
			{Day: 3, Hour: 10, PageViewCount: 0},
			{Day: 3, Hour: 12, PageViewCount: 0},
			{Day: 3, Hour: 14, PageViewCount: 2},
			{Day: 3, Hour: 16, PageViewCount: 0},
			{Day: 3, Hour: 18, PageViewCount: 0},
			{Day: 3, Hour: 20, PageViewCount: 0},
			{Day: 3, Hour: 22, PageViewCount: 0},
			{Day: 4, Hour: 0, PageViewCount: 0},
			{Day: 4, Hour: 2, PageViewCount: 0},
			{Day: 4, Hour: 4, PageViewCount: 0},
			{Day: 4, Hour: 6, PageViewCount: 0},
			{Day: 4, Hour: 8, PageViewCount: 9},
			{Day: 4, Hour: 10, PageViewCount: 0},
			{Day: 4, Hour: 12, PageViewCount: 0},
			{Day: 4, Hour: 14, PageViewCount: 0},
			{Day: 4, Hour: 16, PageViewCount: 0},
			{Day: 4, Hour: 18, PageViewCount: 0},
			{Day: 4, Hour: 20, PageViewCount: 0},
			{Day: 4, Hour: 22, PageViewCount: 0},
			{Day: 5, Hour: 0, PageViewCount: 0},
			{Day: 5, Hour: 2, PageViewCount: 0},
			{Day: 5, Hour: 4, PageViewCount: 0},
			{Day: 5, Hour: 6, PageViewCount: 0},
			{Day: 5, Hour: 8, PageViewCount: 0},
			{Day: 5, Hour: 10, PageViewCount: 0},
			{Day: 5, Hour: 12, PageViewCount: 0},
			{Day: 5, Hour: 14, PageViewCount: 0},
			{Day: 5, Hour: 16, PageViewCount: 0},
			{Day: 5, Hour: 18, PageViewCount: 0},
			{Day: 5, Hour: 20, PageViewCount: 0},
			{Day: 5, Hour: 22, PageViewCount: 0},
			{Day: 6, Hour: 0, PageViewCount: 0},
			{Day: 6, Hour: 2, PageViewCount: 0},
			{Day: 6, Hour: 4, PageViewCount: 0},
			{Day: 6, Hour: 6, PageViewCount: 0},
			{Day: 6, Hour: 8, PageViewCount: 0},
			{Day: 6, Hour: 10, PageViewCount: 0},
			{Day: 6, Hour: 12, PageViewCount: 0},
			{Day: 6, Hour: 14, PageViewCount: 0},
			{Day: 6, Hour: 16, PageViewCount: 0},
			{Day: 6, Hour: 18, PageViewCount: 0},
			{Day: 6, Hour: 20, PageViewCount: 0},
			{Day: 6, Hour: 22, PageViewCount: 0},
			{Day: 7, Hour: 0, PageViewCount: 0},
			{Day: 7, Hour: 2, PageViewCount: 0},
			{Day: 7, Hour: 4, PageViewCount: 0},
			{Day: 7, Hour: 6, PageViewCount: 0},
			{Day: 7, Hour: 8, PageViewCount: 0},
			{Day: 7, Hour: 10, PageViewCount: 0},
			{Day: 7, Hour: 12, PageViewCount: 0},
			{Day: 7, Hour: 14, PageViewCount: 0},
			{Day: 7, Hour: 16, PageViewCount: 0},
			{Day: 7, Hour: 18, PageViewCount: 0},
			{Day: 7, Hour: 20, PageViewCount: 0},
			{Day: 7, Hour: 22, PageViewCount: 6},
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
