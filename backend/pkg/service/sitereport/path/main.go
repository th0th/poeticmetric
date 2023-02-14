package path

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
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
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
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
			"round(100 * countIf(duration == 0) / view_count) as bounce_percentage",
			"path",
			"url",
			"count(*) as view_count",
			"round(100 * view_count / total_views.count) as view_percentage",
			"count(distinct visitor_id) as visitor_count",
			"round(100 * visitor_count / total_visitors.count) as visitor_percentage",
		).
		Group("path, url, total_visitors.count, total_views.count").
		Order("visitor_count desc, path")

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
		Limit(pagination.Size).
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	if len(report.Data) > 1 {
		report.PaginationCursor = &PaginationCursor{
			Path:         report.Data[len(report.Data)-1].Path,
			VisitorCount: report.Data[len(report.Data)-1].VisitorCount,
		}
	}

	return report, nil
}

func (pc *PaginationCursor) MarshalJSON() ([]byte, error) {
	type Alias PaginationCursor

	return pagination.SerializePaginationCursor((*Alias)(pc))
}

func (pc *PaginationCursor) UnmarshalJSON(data []byte) error {
	type Alias PaginationCursor

	a := &Alias{}

	err := pagination.DeserializePaginationCursor(a, data)
	if err != nil {
		return err
	}

	pc.Path = a.Path
	pc.VisitorCount = a.VisitorCount

	return nil
}
