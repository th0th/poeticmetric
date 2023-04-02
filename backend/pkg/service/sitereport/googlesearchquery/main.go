package googlesearchquery

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/url"

	"github.com/go-errors/errors"
	"golang.org/x/oauth2"
	"google.golang.org/api/option"
	"google.golang.org/api/searchconsole/v1"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/env"
	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/organization"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/filter"
	"github.com/th0th/poeticmetric/backend/pkg/service/sitereport/pagination"
)

type Datum struct {
	Clicks      uint64  `json:"clicks"`
	Ctr         float64 `json:"ctr"`
	Impressions uint64  `json:"impressions"`
	Position    float64 `json:"position"`
	Query       string  `json:"query"`
}

func Get(dp *depot.Depot, filters *filter.Filters, page *uint64) ([]*Datum, error) {
	ctx := context.Background()

	result := &struct {
		OrganizationGoogleOauthRefreshToken string
		OrganizationId                      uint64
		SiteDomain                          string
		SiteGoogleSearchConsoleSiteUrl      string
	}{}

	err := dp.Postgres().
		Model(&model.Site{}).
		Joins("inner join organizations on organizations.id = sites.organization_id").
		Select(
			"organizations.google_oauth_refresh_token as organization_google_oauth_refresh_token",
			"organizations.id as organization_id",
			"sites.domain as site_domain",
			"sites.google_search_console_site_url as site_google_search_console_site_url",
		).
		Where("sites.id = ?", filters.SiteId).
		First(result).
		Error
	if err != nil {
		return nil, err
	}

	googleOauthToken := &oauth2.Token{RefreshToken: result.OrganizationGoogleOauthRefreshToken}

	service, err := searchconsole.NewService(ctx, option.WithTokenSource(env.GetGoogleOauthConfig().TokenSource(ctx, googleOauthToken)))
	if err != nil {
		return nil, errors.Wrap(err, 0)
	}

	s2 := searchconsole.NewSearchanalyticsService(service)

	queryFilters := []*searchconsole.ApiDimensionFilter{}

	if filters.CountryIsoCode != nil {
		queryFilters = append(queryFilters, &searchconsole.ApiDimensionFilter{
			Dimension:  "COUNTRY",
			Expression: *filters.CountryIsoCode,
			Operator:   "EQUALS",
		})
	}

	if filters.DeviceType != nil {
		queryFilters = append(queryFilters, &searchconsole.ApiDimensionFilter{
			Dimension:  "DEVICE",
			Expression: *filters.DeviceType,
			Operator:   "EQUALS",
		})
	}

	if filters.Path != nil {
		queryFilters = append(queryFilters, &searchconsole.ApiDimensionFilter{
			Dimension:  "PAGE",
			Expression: fmt.Sprintf("https?://%s%s$", "www.webgazer.io", *filters.Path),
			Operator:   "INCLUDING_REGEX",
		})
	}

	queryRequest := &searchconsole.SearchAnalyticsQueryRequest{
		AggregationType:       "BY_PAGE",
		DataState:             "ALL",
		DimensionFilterGroups: []*searchconsole.ApiDimensionFilterGroup{{Filters: queryFilters}},
		Dimensions:            []string{"QUERY"},
		EndDate:               filters.End.Format("2006-01-02"),
		RowLimit:              pagination.Size,
		StartDate:             filters.Start.Format("2006-01-02"),
	}

	if page != nil {
		queryRequest.StartRow = int64(*page) * pagination.Size
	}

	queryResponse, err := s2.Query(result.SiteGoogleSearchConsoleSiteUrl, queryRequest).Do()
	if err != nil {
		urlError, isOk := err.(*url.Error)
		if isOk {
			oauth2RetrieveError, isOk2 := urlError.Err.(*oauth2.RetrieveError)
			if isOk2 {
				var response map[string]any

				err2 := json.Unmarshal(oauth2RetrieveError.Body, &response)
				if err2 != nil {
					return nil, errors.Wrap(err2, 0)
				}

				if response["error_description"] == "Token has been expired or revoked." {
					_, err3 := organization.ClearGoogleAuth(dp, result.OrganizationId)
					if err3 != nil {
						return nil, err3
					}

					return nil, sitereport.ErrInvalidGoogleOauthToken
				}
			}
		}

		return nil, errors.Wrap(err, 0)
	}

	data := []*Datum{}

	for _, row := range queryResponse.Rows {
		data = append(data, &Datum{
			Clicks:      uint64(row.Clicks),
			Ctr:         math.Round(row.Ctr) / 100,
			Impressions: uint64(row.Impressions),
			Position:    math.Round(row.Position*100) / 100,
			Query:       row.Keys[0],
		})
	}

	return data, nil
}
