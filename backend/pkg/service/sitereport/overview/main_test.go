package overview

import (
	"math"
	"testing"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/go-errors/errors"
	"github.com/google/uuid"
	"github.com/stretchr/testify/assert"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	h "github.com/th0th/poeticmetric/backend/pkg/testhelper"
	"github.com/th0th/poeticmetric/backend/pkg/utils"
)

func TestGet(t *testing.T) {
	dp := h.NewDepot()

	type TestData struct {
		EventWithDurationCount uint64
		PageViewCount          uint64
		TotalDuration          uint64
		VisitorCount           uint64
	}

	eventCount := 1000

	_ = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		start, err := time.Parse("2006-01-02", "2022-01-01")
		assert.NoError(t, err)

		end, err := time.Parse("2006-01-02", "2022-12-31")
		assert.NoError(t, err)

		previousEnd := start
		previousStart := start.Add(start.Sub(end))

		modelSite := h.Site(dp2, nil)

		modelEvents := []*model.Event{}

		previousTestData := &TestData{}
		visitorId := ""

		for previousEventIndex := 0; previousEventIndex < eventCount; previousEventIndex += 1 {
			if visitorId == "" || gofakeit.IntRange(0, 100) < 85 {
				previousTestData.VisitorCount += 1

				visitorId = uuid.NewString()
			}

			duration := uint32(gofakeit.IntRange(0, 100))

			if duration > 0 {
				previousTestData.EventWithDurationCount += 1
			}

			previousTestData.TotalDuration += uint64(duration)

			modelEvents = append(modelEvents, &model.Event{
				DateTime:  gofakeit.DateRange(previousStart, previousEnd),
				Duration:  duration,
				Id:        uuid.NewString(),
				SiteId:    modelSite.Id,
				VisitorId: visitorId,
			})

			previousTestData.PageViewCount += 1
		}

		testData := &TestData{}
		visitorId = ""

		for eventIndex := 0; eventIndex < eventCount; eventIndex += 1 {
			if visitorId == "" || gofakeit.IntRange(0, 100) < 85 {
				testData.VisitorCount += 1

				visitorId = uuid.NewString()
			}

			duration := uint32(gofakeit.IntRange(0, 200))

			if duration > 0 {
				testData.EventWithDurationCount += 1
			}

			testData.TotalDuration += uint64(duration)

			modelEvents = append(modelEvents, &model.Event{
				DateTime:  gofakeit.DateRange(start, end),
				Duration:  duration,
				Id:        uuid.NewString(),
				Kind:      model.EventKindPageView,
				SiteId:    modelSite.Id,
				VisitorId: visitorId,
			})

			testData.PageViewCount += 1
		}

		err = dp2.ClickHouse().
			Create(&modelEvents).
			Error
		assert.NoError(t, err)

		report, err := Get(dp2, &filter.Filters{
			End:    end,
			SiteId: modelSite.Id,
			Start:  start,
		})
		assert.NoError(t, err)

		expectedReport := &Report{
			AveragePageViewDuration: uint64(math.Round(float64(testData.TotalDuration) / float64(testData.EventWithDurationCount))),
			AveragePageViewDurationPercentageChange: utils.CalculatePercentageChange(
				uint64(math.Round(float64(previousTestData.TotalDuration)/float64(previousTestData.EventWithDurationCount))),
				uint64(math.Round(float64(testData.TotalDuration)/float64(testData.EventWithDurationCount))),
			),
			PageViewCount:                 testData.PageViewCount,
			PageViewCountPercentageChange: utils.CalculatePercentageChange(previousTestData.PageViewCount, testData.PageViewCount),
			PageViewCountPerVisitor:       math.Round(10*float64(testData.PageViewCount)/float64(testData.VisitorCount)) / 10,
			PageViewCountPerVisitorPercentageChange: utils.CalculatePercentageChange(
				math.Round(10*float64(previousTestData.PageViewCount)/float64(previousTestData.VisitorCount))/10,
				math.Round(10*float64(testData.PageViewCount)/float64(testData.VisitorCount))/10,
			),
			VisitorCount:                 testData.VisitorCount,
			VisitorCountPercentageChange: utils.CalculatePercentageChange(previousTestData.VisitorCount, testData.VisitorCount),
		}

		assert.Equal(t, expectedReport, report)

		err = dp2.ClickHouse().
			Exec("optimize table events_buffer").
			Error
		assert.NoError(t, err)

		err = dp2.ClickHouse().
			Table("events").
			Where("site_id = ?", modelSite.Id).
			Delete(nil).
			Error
		if err != nil {
			return err
		}

		return errors.New("")
	})
}
