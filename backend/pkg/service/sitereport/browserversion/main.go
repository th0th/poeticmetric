package browserversion

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
)

type Datum struct {
	BrowserName       string `json:"browserName"`
	BrowserVersion    string `json:"browserVersion"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	BrowserVersion string `json:"browserVersion"`
	VisitorCount   uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	err := validateFilters(filters)
	if err != nil {
		return nil, err
	}

	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("browser_version is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id) as count")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (?) total_visitors", totalVisitorCountSubQuery).
		Select(
			"browser_name",
			"browser_version",
			"count(distinct visitor_id) as visitor_count",
			"toUInt16(round(100 * visitor_count / total_visitors.count)) as visitor_percentage",
		).
		Group("browser_name, browser_version, total_visitors.count").
		Order("visitor_count desc")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery).
		Limit(pagination.Size)

	if paginationCursor != nil {
		query.Where(
			"(visitor_count = ? and browser_version > ?) or visitor_count < ?",
			paginationCursor.VisitorCount,
			paginationCursor.BrowserVersion,
			paginationCursor.VisitorCount,
		)
	}

	err = query.
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	if len(report.Data) == pagination.Size {
		report.PaginationCursor = &PaginationCursor{
			BrowserVersion: report.Data[pagination.Size-1].BrowserVersion,
			VisitorCount:   report.Data[pagination.Size-1].VisitorCount,
		}
	}

	return report, nil
}

func validateFilters(filters *filter.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("browserName", filters.BrowserName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
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

	pc.BrowserVersion = a.BrowserVersion
	pc.VisitorCount = a.VisitorCount

	return nil
}
