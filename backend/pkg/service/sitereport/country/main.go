package country

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/country"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/poeticmetric/poeticmetric/backend/pkg/service/sitereport/pagination"
	"gorm.io/gorm"
)

type Datum struct {
	Country           string `json:"country"`
	CountryIsoCode    string `json:"countryIsoCode"`
	VisitorCount      uint64 `json:"visitorCount"`
	VisitorPercentage uint16 `json:"visitorPercentage"`
}

type PaginationCursor struct {
	CountryIsoCode string `json:"countryIsoCode"`
	VisitorCount   uint64 `json:"visitorCount"`
}

type Report struct {
	Data             []*Datum          `json:"data"`
	PaginationCursor *PaginationCursor `json:"paginationCursor"`
}

func Get(dp *depot.Depot, filters *filter.Filters, paginationCursor *PaginationCursor) (*Report, error) {
	report := &Report{}

	baseQuery := filter.Apply(dp, filters).
		Where("country_iso_code is not null")

	totalVisitorCountSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Select("count(distinct visitor_id) as count")

	baseSubQuery := baseQuery.
		Session(&gorm.Session{}).
		Joins("cross join (?) total_visitors", totalVisitorCountSubQuery).
		Select(
			"country_iso_code",
			"count(distinct visitor_id) as visitor_count",
			"toUInt16(round(100 * visitor_count / total_visitors.count)) as visitor_percentage",
		).
		Group("country_iso_code, total_visitors.count").
		Order("visitor_count desc, country_iso_code")

	query := dp.ClickHouse().
		Table("(?)", baseSubQuery)

	if paginationCursor != nil {
		query.
			Where(
				"visitor_count < ? or (visitor_count = ? and country_iso_code > ?)",
				paginationCursor.VisitorCount,
				paginationCursor.VisitorCount,
				paginationCursor.CountryIsoCode,
			)
	}

	err := query.
		Limit(pagination.Size).
		Find(&report.Data).
		Error
	if err != nil {
		return nil, err
	}

	for i := range report.Data {
		report.Data[i].Country = country.GetNameFromIsoCode(report.Data[i].CountryIsoCode)
	}

	if len(report.Data) == pagination.Size {
		report.PaginationCursor = &PaginationCursor{
			CountryIsoCode: report.Data[len(report.Data)-1].CountryIsoCode,
			VisitorCount:   report.Data[len(report.Data)-1].VisitorCount,
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

	pc.CountryIsoCode = a.CountryIsoCode
	pc.VisitorCount = a.VisitorCount

	return nil
}
