package utmterm

import (
	"strings"

	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
)

type Datum struct {
	UtmTerm           string `json:"utmTerm"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	UtmTerm      string `json:"utmTerm"`
	VisitorCount uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("utm_term is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"utm_term",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("utm_term").
		Order("visitor_count desc, utm_term")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"(visitor_count = ? and utm_term > ?) or visitor_count < ?",
				paginationCursor.VisitorCount,
				paginationCursor.UtmTerm,
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
			UtmTerm:      report.Data[pagination.Size-1].UtmTerm,
			VisitorCount: report.Data[pagination.Size-1].VisitorCount,
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

	pc.UtmTerm = a.UtmTerm
	pc.VisitorCount = a.VisitorCount

	return nil
}
