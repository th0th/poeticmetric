package visitor

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
	DateTime     time.Time `json:"dateTime"`
	VisitorCount *uint64   `json:"visitorCount"`
}

type Report struct {
	AverageVisitorCount uint64             `json:"averageVisitorCount"`
	Data                []Datum            `json:"data"`
	Interval            *interval.Interval `json:"interval"`
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
				"count(distinct visitor_id) as visitor_count",
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
					"if(date_time > now(), null, 0) as visitor_count",
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
			"sum(visitor_count) as visitor_count",
		).
		Group("date_time").
		Order("date_time").
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	// AverageVisitorCount
	var visitorCountsSum float64 = 0
	var visitorCountsLength float64 = 0

	for _, d := range report.Data {
		if d.VisitorCount != nil {
			visitorCountsSum += float64(*d.VisitorCount)
			visitorCountsLength += 1
		}
	}

	if visitorCountsLength != 0 {
		report.AverageVisitorCount = uint64(math.Round(visitorCountsSum / visitorCountsLength))
	}

	return report, nil
}
