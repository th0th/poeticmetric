package operatingsystemname

import (
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
)

type Datum struct {
	OperatingSystemName string `json:"operatingSystemName"`
	VisitorCount        uint64 `json:"visitorCount"`
	VisitorPercentage   uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	OperatingSystemName string `json:"operatingSystemName"`
	VisitorCount        uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("operating_system_name is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id) as count")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (?) total_visitors", totalVisitorCountSubQuery).
		Select(
			"operating_system_name",
			"count(distinct visitor_id) as visitor_count",
			"toUInt16(round(100 * visitor_count / total_visitors.count)) as visitor_percentage",
		).
		Group("operating_system_name, total_visitors.count").
		Order("visitor_count desc, operating_system_name")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"(visitor_count = ? and operating_system_name > ?) or visitor_count < ?",
				paginationCursor.VisitorCount,
				paginationCursor.OperatingSystemName,
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
			OperatingSystemName: report.Data[pagination.Size-1].OperatingSystemName,
			VisitorCount:        report.Data[pagination.Size-1].VisitorCount,
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

	pc.OperatingSystemName = a.OperatingSystemName
	pc.VisitorCount = a.VisitorCount

	return nil
}
