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

func SiteReportFiltersHandler(decoder *schema.Decoder, responder poeticmetric.RestApiResponder) func(http.Handler) http.Handler {
	return func(handler http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			siteReportFilters := poeticmetric.SiteReportFilters{}
			err := decoder.Decode(&siteReportFilters, r.URL.Query())
			if err != nil {
				responder.Error(w, errors.Wrap(err, 0))
				return
			}

			r = r.WithContext(context.WithValue(r.Context(), siteReportFiltersKey, &siteReportFilters))

			handler.ServeHTTP(w, r)
		})
	}
}
