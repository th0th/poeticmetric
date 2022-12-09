package pathvisitor

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/pagination"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	sitereportpagination "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
	"strings"
)

type PaginationCursor struct {
	Path         string `json:"path"`
	VisitorCount uint64 `json:"visitorCount"`
}

type Datum struct {
	AverageDuration   uint32  `json:"averageDuration"`
	Path              string  `json:"path"`
	Url               string  `json:"url"`
	ViewCount         uint64  `json:"viewCount"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float64 `json:"visitorPercentage"`
}

type Report struct {
	Data             []*Datum `json:"data"`
	PaginationCursor *string  `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters)

	totalCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	fromSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"round(avg(duration)) as average_duration",
				"path",
				"url",
				"count(*) as view_count",
				"count(distinct visitor_id) as visitor_count",
				"round(100 * count(*) / (@totalCountSubQuery), 2) as visitor_percentage",
			}, ","),
			map[string]any{
				"totalCountSubQuery": totalCountSubQuery,
			},
		).
		Group("path, url").
		Order("visitor_count desc, path asc")

	query := dp.ClickHouse().
		Table("(?)", fromSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"(visitor_count = ? and path > ?) or visitor_count < ?",
				paginationCursor.VisitorCount,
				paginationCursor.Path,
				paginationCursor.VisitorCount,
			)
	}

	err := query.
		Limit(sitereportpagination.Size).
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	report.PaginationCursor = pagination.GetPaginationCursor[PaginationCursor](report.Data)

	return report, nil
}
