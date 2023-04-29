package utmsource

import (
	"strings"

	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
)

type Datum struct {
	UtmSource         string `json:"utmSource"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	UtmSource    string `json:"utmSource"`
	VisitorCount uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Session(&gorm.Session{}).
		Where("utm_source is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"utm_source",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("utm_source").
		Order("visitor_count desc, utm_source")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"(visitor_count = ? and utm_source > ?) or visitor_count < ?",
				paginationCursor.VisitorCount,
				paginationCursor.UtmSource,
				paginationCursor.VisitorCount,
			)
	}

	err := query.
		Limit(pagination.Size).
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	if len(report.Data) == pagination.Size {
		report.PaginationCursor = &PaginationCursor{
			UtmSource:    report.Data[len(report.Data)-1].UtmSource,
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

	pc.UtmSource = a.UtmSource
	pc.VisitorCount = a.VisitorCount

	return nil
}
