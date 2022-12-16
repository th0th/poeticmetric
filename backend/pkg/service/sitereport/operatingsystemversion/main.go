package operatingsystemversion

import (
	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
)

type Datum struct {
	OperatingSystemName    string `json:"operatingSystemName"`
	OperatingSystemVersion string `json:"operatingSystemVersion"`
	VisitorCount           uint64 `json:"visitorCount"`
	VisitorPercentage      uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	OperatingSystemVersion string `json:"operatingSystemVersion"`
	VisitorCount           uint64 `json:"visitorCount"`
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
		Where("operating_system_version is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id) as count")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (?) total_visitors", totalVisitorCountSubQuery).
		Select(
			"operating_system_name",
			"operating_system_version",
			"count(distinct visitor_id) as visitor_count",
			"toUInt16(round(100 * visitor_count / total_visitors.count)) as visitor_percentage",
		).
		Group("operating_system_name, operating_system_version, total_visitors.count").
		Order("visitor_count desc, operating_system_version")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"(visitor_count = ? and operating_system_version > ?) or visitor_count < ?",
				paginationCursor.VisitorCount,
				paginationCursor.OperatingSystemVersion,
				paginationCursor.VisitorCount,
			)
	}

	err = query.
		Limit(pagination.Size).
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	if len(report.Data) == pagination.Size {
		report.PaginationCursor = &PaginationCursor{
			OperatingSystemVersion: report.Data[pagination.Size-1].OperatingSystemVersion,
			VisitorCount:           report.Data[pagination.Size-1].VisitorCount,
		}
	}

	return report, nil
}

func validateFilters(filters *filter.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("operatingSystemName", filters.OperatingSystemName): v.All(
			v.Nonzero[*string]().Msg("This field is required."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
