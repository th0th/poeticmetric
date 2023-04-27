package referrerpath

import (
	"strings"

	v "github.com/RussellLuo/validating/v3"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
)

type Datum struct {
	Referrer          string `json:"referrer"`
	ReferrerPath      string `json:"referrerPath"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	ReferrerPath string `json:"referrerPath"`
	VisitorCount uint64 `json:"visitorCount"`
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
		Where("referrer is not null").
		Where("protocol(referrer) in ('http', 'https')").
		Where("domain(referrer) != domain(events_buffer.url)")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id)")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select(
			strings.Join([]string{
				"referrer",
				"pathFull(referrer) as referrer_path",
				"count(distinct visitor_id) as visitor_count",
				"toUInt16(round(100 * visitor_count / (@totalVisitorCountSubQuery))) as visitor_percentage",
			}, ", "),
			map[string]any{
				"totalVisitorCountSubQuery": totalVisitorCountSubQuery,
			},
		).
		Group("referrer").
		Order("visitor_count desc, referrer_path")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"visitor_count < ? or (visitor_count = ? and referrer_path > ?)",
				paginationCursor.VisitorCount,
				paginationCursor.VisitorCount,
				paginationCursor.ReferrerPath,
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
			ReferrerPath: report.Data[len(report.Data)-1].ReferrerPath,
			VisitorCount: report.Data[len(report.Data)-1].VisitorCount,
		}
	}

	return report, nil
}

func validateFilters(filters *filter.Filters) error {
	errs := v.Validate(v.Schema{
		v.F("referrerSite", filters.ReferrerSite): v.All(
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

	pc.ReferrerPath = a.ReferrerPath
	pc.VisitorCount = a.VisitorCount

	return nil
}
