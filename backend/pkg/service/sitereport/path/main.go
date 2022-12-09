package path

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/pagination"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	sitereportpagination "github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
)

type PaginationCursor struct {
	Path         string `json:"path"`
	VisitorCount uint64 `json:"visitorCount"`
}

type Datum struct {
	AverageDuration   uint32  `json:"averageDuration"`
	BouncePercentage  float32 `json:"bouncePercentage"`
	Path              string  `json:"path"`
	Url               string  `json:"url"`
	ViewCount         uint64  `json:"viewCount"`
	ViewPercentage    float32 `json:"viewPercentage"`
	VisitorCount      uint64  `json:"visitorCount"`
	VisitorPercentage float32 `json:"visitorPercentage"`
}

type Report struct {
	Data             []*Datum `json:"data"`
	PaginationCursor *string  `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters)

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (select count(distinct visitor_id) as count from events_buffer) total_visitors").
		Joins("cross join (select count(1) as count from events_buffer) total_views").
		Select(
			"round(avg(duration)) as average_duration",
			"round(100 * countIf(is_bounce = 1) / view_count) as bounce_percentage",
			"path",
			"url",
			"count(*) as view_count",
			"round(100 * view_count / total_views.count) as view_percentage",
			"count(distinct visitor_id) as visitor_count",
			"round(100 * visitor_count / total_visitors.count) as visitor_percentage",
		).
		Group("path, url, total_visitors.count, total_views.count").
		Order("visitor_count desc, path asc")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"visitor_count < ? or (visitor_count = ? and path > ?)",
				paginationCursor.VisitorCount,
				paginationCursor.VisitorCount,
				paginationCursor.Path,
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
