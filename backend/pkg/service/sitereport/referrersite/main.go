package referrersite

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
)

type Datum struct {
	Domain            string `json:"domain"`
	ReferrerSite      string `json:"referrerSite"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	ReferrerSite string `json:"referrerSite"`
	VisitorCount uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("referrer is not null").
		Where("protocol(referrer) in ('http', 'https')").
		Where("domain(referrer) != domain(events_buffer.url)")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id) as count")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (?) total_visitors", totalVisitorCountSubQuery).
		Select(
			"domain(referrer) as domain",
			"concat(protocol(referrer), '://', domain(referrer)) as referrer_site",
			"count(distinct visitor_id) as visitor_count",
			"toUInt16(round(100 * visitor_count / total_visitors.count)) as visitor_percentage",
		).
		Group("domain, referrer_site, total_visitors.count").
		Order("visitor_count desc, referrer_site")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"visitor_count < ? or (visitor_count = ? and referrer_site > ?)",
				paginationCursor.VisitorCount,
				paginationCursor.VisitorCount,
				paginationCursor.ReferrerSite,
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
			ReferrerSite: report.Data[len(report.Data)-1].ReferrerSite,
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

	pc.ReferrerSite = a.ReferrerSite
	pc.VisitorCount = a.VisitorCount

	return nil
}
