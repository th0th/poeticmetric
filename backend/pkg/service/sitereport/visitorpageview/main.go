package visitorpageview

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/interval"
	"gorm.io/gorm"
	"math"
	"strings"
	"time"
)

type Datum struct {
	DateTime      time.Time `json:"dateTime"`
	PageViewCount uint64    `json:"pageViewCount"`
	VisitorCount  uint64    `json:"visitorCount"`
}

type Report struct {
	AveragePageViewCount uint64             `json:"averagePageViewCount"`
	AverageVisitorCount  uint64             `json:"averageVisitorCount"`
	Data                 []Datum            `json:"data"`
	Interval             *interval.Interval `json:"interval"`
}

func Get(dp *depot.Depot, filters *filter.Filters) (*Report, error) {
	interval := interval.GetVisitorPageViewInterval(filters)
	report := &Report{
		Interval: interval,
	}

	q := filter.Apply(dp, filters)

	valueSubQuery := q.
		Select(
			strings.Join([]string{
				"toStartOfInterval(date_time, @timeWindowInterval, @timeZone) as date_time",
				"count(*) as page_view_count",
				"count(distinct visitor_id) as visitor_count",
			}, ","),
			map[string]interface{}{
				"timeWindowInterval": gorm.Expr(interval.ToQuery()),
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
					"0 as page_view_count",
					"0 as visitor_count",
				}, ","),
			}, " "),
			map[string]any{
				"end":             filters.End,
				"intervalSeconds": interval.ToDuration().Seconds(),
				"start":           filters.Start,
			},
		)

	err := dp.ClickHouse().
		Table("((?) union all (?))", valueSubQuery, fillerSubQuery).
		Select(
			"date_time",
			"sum(page_view_count) as page_view_count",
			"sum(visitor_count) as visitor_count",
		).
		Group("date_time").
		Order("date_time").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	// AveragePageViewCount
	var length float64 = 0
	var pageViewCountsSum float64 = 0
	var visitorCountSum float64 = 0

	for _, d := range report.Data {
		length += 1
		pageViewCountsSum += float64(d.PageViewCount)
		visitorCountSum += float64(d.VisitorCount)
	}

	if length != 0 {
		report.AveragePageViewCount = uint64(math.Round(pageViewCountsSum / length))
		report.AverageVisitorCount = uint64(math.Round(visitorCountSum / length))
	}

	return report, nil
}
