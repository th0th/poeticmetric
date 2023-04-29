package path

import (
	"fmt"
	"math"
	"sort"
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
)

func TestGet(t *testing.T) {
	type TestDatum struct {
		AverageDuration     uint32
		BounceCount         uint64
		PageViewsPerVisitor uint64
		Path                string
		VisitorCount        uint64
	}

	dp := h.NewDepot()

	_ = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		start, err := time.Parse("2006-01-02", "2022-01-01")
		assert.NoError(t, err)

		end, err := time.Parse("2006-01-02", "2022-12-31")
		assert.NoError(t, err)

		testData := []*TestDatum{}

		for datumIndex := 0; datumIndex <= 12; datumIndex += 1 {
			testDatum := &TestDatum{
				AverageDuration:     uint32(gofakeit.IntRange(0, 600)),
				PageViewsPerVisitor: uint64(gofakeit.IntRange(1, 3)),
				Path:                h.GetRandomUrlPath(),
				VisitorCount:        uint64(gofakeit.IntRange(0, 1000)),
			}

			testDatum.BounceCount = uint64(gofakeit.IntRange(0, int(testDatum.VisitorCount*testDatum.PageViewsPerVisitor)))

			testData = append(testData, testDatum)
		}

		sort.Slice(testData, func(i, j int) bool {
			if testData[i].VisitorCount > testData[j].VisitorCount {
				return true
			}

			if testData[i].VisitorCount == testData[j].VisitorCount {
				return testData[i].Path > testData[j].Path
			}

			return false
		})

		modelSite := h.Site(dp2, nil)

		events := []*model.Event{}

		var totalViewCount, totalVisitorCount uint64

		for _, testDatum := range testData {
			totalVisitorCount += testDatum.VisitorCount
			totalViewCount += testDatum.VisitorCount * testDatum.PageViewsPerVisitor

			var visitorIndex uint64

			for visitorIndex = 0; visitorIndex < testDatum.VisitorCount; visitorIndex += 1 {
				visitorId := uuid.NewString()

				var pageIndex uint64

				for pageIndex = 0; pageIndex < testDatum.PageViewsPerVisitor; pageIndex += 1 {
					events = append(events, &model.Event{
						Duration:  testDatum.AverageDuration,
						Url:       fmt.Sprintf("https://%s%s", modelSite.Domain, testDatum.Path),
						DateTime:  gofakeit.DateRange(start, end),
						Id:        uuid.NewString(),
						SiteId:    modelSite.Id,
						VisitorId: visitorId,
					})
				}
			}
		}

		err2 := dp2.ClickHouse().
			Create(&events).
			Error
		assert.NoError(t, err2)

		report, err2 := Get(dp2, &filter.Filters{
			End:    end,
			SiteId: modelSite.Id,
			Start:  start,
		}, nil)
		assert.NoError(t, err2)

		expectedReport := &Report{
			Data: []*Datum{},
			PaginationCursor: &PaginationCursor{
				Path:         testData[9].Path,
				VisitorCount: testData[9].VisitorCount,
			},
		}

		for _, testDatum := range testData[0:10] {
			expectedReport.Data = append(expectedReport.Data, &Datum{
				AverageDuration:   testDatum.AverageDuration,
				BouncePercentage:  float32(math.Round(100 * float64(testDatum.BounceCount/(testDatum.VisitorCount*testDatum.PageViewsPerVisitor)))),
				Path:              testDatum.Path,
				Url:               fmt.Sprintf("https://%s%s", modelSite.Domain, testDatum.Path),
				ViewCount:         testDatum.VisitorCount * testDatum.PageViewsPerVisitor,
				ViewPercentage:    float32(math.Round(100 * float64(testDatum.VisitorCount*testDatum.PageViewsPerVisitor) / float64(totalViewCount))),
				VisitorCount:      testDatum.VisitorCount,
				VisitorPercentage: float32(math.Round(100 * float64(testDatum.VisitorCount) / float64(totalVisitorCount))),
			})
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
