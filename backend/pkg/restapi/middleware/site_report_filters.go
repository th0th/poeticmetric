package middleware

import (
	"context"
	"net/http"

	"github.com/go-errors/errors"
	"github.com/gorilla/schema"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

const siteReportFiltersKey siteReportFiltersKeyType = "siteReportFilters"

func GetSiteReportFilters(r *http.Request) *poeticmetric.SiteReportFilters {
	return r.Context().Value(siteReportFiltersKey).(*poeticmetric.SiteReportFilters)
}

type SiteReportFiltersHandlerParams struct {
	Responder poeticmetric.RestApiResponder
}

type siteReportFiltersKeyType string

func SiteReportFiltersHandler(
	validationService poeticmetric.ValidationService,
	decoder *schema.Decoder,
	responder poeticmetric.RestApiResponder,
) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth := GetAuthentication(r.Context())

			filters := poeticmetric.SiteReportFilters{}
			err := decoder.Decode(&filters, r.URL.Query())
			if err != nil {
				responder.Error(w, errors.Wrap(err, 0))
				return
			}

			var organizationID *uint
			if auth != nil && auth.User != nil {
				organizationID = &auth.User.OrganizationID
			}

			err = validationService.SiteReportFilters(r.Context(), organizationID, &filters)
			if err != nil {
				responder.Error(w, errors.Wrap(err, 0))
				return
			}

			r = r.WithContext(context.WithValue(r.Context(), siteReportFiltersKey, &filters))

			handler.ServeHTTP(w, r)
		})
	}
}
