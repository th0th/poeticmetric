package referrerpath

import (
	"errors"
	"fmt"
	"math"
	"sort"
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

func TestGet(t *testing.T) {
	type TestDatum struct {
		Referrer     *string
		ReferrerPath *string
		VisitorCount uint64
	}

	dp := h.NewDepot()

	_ = dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		referrerSite := "https://www.referrersite.com"

		start, err := time.Parse("2006-01-02", "2022-01-01")
		assert.NoError(t, err)

		end, err := time.Parse("2006-01-02", "2022-12-31")
		assert.NoError(t, err)

		testData := []*TestDatum{
			{VisitorCount: uint64(gofakeit.IntRange(1, 100))},
		}

		var totalVisitorCount uint64

		for testDatumIndex := 0; testDatumIndex < 12; testDatumIndex += 1 {
			visitorCount := uint64(gofakeit.IntRange(1, 1000))
			totalVisitorCount += visitorCount
			referrerPath := fmt.Sprintf("/referrer-path-%d", testDatumIndex+1)

			testData = append(testData, &TestDatum{
				Referrer:     pointer.Get(fmt.Sprintf("%s%s", referrerSite, referrerPath)),
				ReferrerPath: &referrerPath,
				VisitorCount: visitorCount,
			})
		}

		modelSite := h.Site(dp2, nil)
		modelEvents := []*model.Event{}

		for _, testDatum := range testData {
			var visitorIndex uint64

			for visitorIndex = 0; visitorIndex < testDatum.VisitorCount; visitorIndex += 1 {
				visitorId := uuid.NewString()
				viewCount := gofakeit.IntRange(1, 10)

				for viewIndex := 0; viewIndex < viewCount; viewIndex += 1 {
					var referrer *string

					if testDatum.ReferrerPath != nil {
						referrer = pointer.Get(fmt.Sprintf("%s%s", referrerSite, *testDatum.ReferrerPath))
					}

					modelEvents = append(modelEvents, &model.Event{
						DateTime:  gofakeit.DateRange(start, end),
						Id:        uuid.NewString(),
						Kind:      model.EventKindPageView,
						SiteId:    modelSite.Id,
						Referrer:  referrer,
						VisitorId: visitorId,
					})
				}
			}
		}

		filteredTestData := []*TestDatum{}

		for _, testDatum := range testData {
			if testDatum.ReferrerPath != nil {
				filteredTestData = append(filteredTestData, testDatum)
			}
		}

		sort.Slice(filteredTestData, func(i, j int) bool {
			if filteredTestData[i].VisitorCount > filteredTestData[j].VisitorCount {
				return true
			}

			if filteredTestData[i].VisitorCount == filteredTestData[j].VisitorCount {
				return *filteredTestData[i].ReferrerPath > *filteredTestData[j].ReferrerPath
			}

			return false
		})

		expectedReport := &Report{
			PaginationCursor: &PaginationCursor{
				ReferrerPath: *filteredTestData[9].ReferrerPath,
				VisitorCount: filteredTestData[9].VisitorCount,
			},
		}

		for _, testDatum := range filteredTestData[0:10] {
			expectedReport.Data = append(expectedReport.Data, &Datum{
				Referrer:          *testDatum.Referrer,
				ReferrerPath:      *testDatum.ReferrerPath,
				VisitorCount:      testDatum.VisitorCount,
				VisitorPercentage: uint16(math.Round(100 * float64(testDatum.VisitorCount) / float64(totalVisitorCount))),
			})
		}

		fmt.Println(len(modelEvents))

		err = dp2.ClickHouse().
			Create(&modelEvents).
			Error
		assert.NoError(t, err)

		report, err := Get(dp2, &filter.Filters{
			End:          end,
			ReferrerSite: &referrerSite,
			SiteId:       modelSite.Id,
			Start:        start,
		}, nil)
		assert.NoError(t, err)

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
