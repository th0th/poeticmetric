package pageview

import (
	"math"
	"strings"
	"time"

	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/interval"
)

type Datum struct {
	DateTime      time.Time `json:"dateTime"`
	PageViewCount *uint64   `json:"pageViewCount"`
}

type Report struct {
	AveragePageViewCount uint64             `json:"averagePageViewCount"`
	Data                 []Datum            `json:"data"`
	Interval             *interval.Interval `json:"interval"`
}

func Get(dp *depot.Depot, filters *filter.Filters) (*Report, error) {
	interval2 := interval.GetVisitorPageViewInterval(filters)
	report := &Report{
		Interval: interval2,
	}

	q := filter.Apply(dp, filters)

	valueSubQuery := q.
		Select(
			strings.Join([]string{
				"toStartOfInterval(date_time, @timeWindowInterval, @timeZone) as date_time",
				"count(*) as page_view_count",
			}, ","),
			map[string]interface{}{
				"timeWindowInterval": gorm.Expr(interval2.ToQuery()),
				"timeZone":           filters.GetTimeZone(),
			},
		).
		Group("date_time")

	fillerSubQuery := dp.ClickHouse().
		Raw(
			strings.Join([]string{
				"select",
				strings.Join([]string{
					"@start + interval arrayJoin(range(0, toUInt64(dateDiff('second', @start, @end)), @intervalSeconds)) second as date_time",
					"if(date_time > now(), null, 0) as page_view_count",
				}, ","),
			}, " "),
			map[string]any{
				"end":             filters.End,
				"intervalSeconds": interval2.ToDuration().Seconds(),
				"start":           filters.Start,
			},
		)

	err := dp.ClickHouse().
		Table("((?) union all (?))", valueSubQuery, fillerSubQuery).
		Select(
			"date_time",
			"sum(page_view_count) as page_view_count",
		).
		Group("date_time").
		Order("date_time").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	// AveragePageViewCount
	var pageViewCountsSum float64 = 0
	var pageViewCountsLength float64 = 0

	for _, d := range report.Data {
		if d.PageViewCount != nil {
			pageViewCountsSum += float64(*d.PageViewCount)
			pageViewCountsLength += 1
		}
	}

	if pageViewCountsLength != 0 {
		report.AveragePageViewCount = uint64(math.Round(pageViewCountsSum / pageViewCountsLength))
	}

	return report, nil
}
