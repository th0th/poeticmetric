package pageviewtrends

import (
	"strings"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"gorm.io/gorm"
)

type Datum struct {
	Day           uint8  `json:"day"`
	Hour          uint8  `json:"hour"`
	PageViewCount uint64 `json:"pageViewCount"`
}

type Report []*Datum

func Get(dp *depot.Depot, filters *filter.Filters) (Report, error) {
	report := Report{}

	baseQuery := filter.Apply(dp, filters)

	valueSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"toDayOfWeek(toTimeZone(date_time, @timeZone)) as day",
				"toHour(toStartOfInterval(toTimeZone(date_time, @timeZone), interval 2 hour)) as hour",
				"count(*) as page_view_count",
			}, ", "),
			map[string]any{
				"timeZone": filters.GetTimeZone(),
			},
		).
		Group("day, hour")

	fillerSubQuery := dp.ClickHouse().
		Raw(
			strings.Join([]string{
				"select",
				strings.Join([]string{
					"arrayJoin(range(1, 8)) as day",
					"arrayJoin(range(0, 24, 2)) as hour",
					"0 as page_view_count",
				}, ", "),
			}, " "),
		)

	err := dp.ClickHouse().
		Table("((?) union all (?))", valueSubQuery, fillerSubQuery).
		Select(
			strings.Join([]string{
				"day",
				"hour",
				"sum(page_view_count) as page_view_count",
			}, ", "),
		).
		Group("day, hour").
		Order("day, hour").
		Find(&report).
		Error
	if err != nil {
		return nil, err
	}

	return report, nil
}
