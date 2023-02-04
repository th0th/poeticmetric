package event

import (
	"fmt"
	"net/url"
	"strings"
	"time"

	v "github.com/RussellLuo/validating/v3"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
	"github.com/poeticmetric/poeticmetric/backend/pkg/validator"
)

type CreatePayload struct {
	DateTime  time.Time
	Duration  *uint32 `json:"d"`
	Id        string  `json:"i"`
	IpAddress string
	Kind      *model.EventKind `json:"k"`
	Locale    *string          `json:"l"`
	Referrer  *string          `json:"r"`
	TimeZone  *string          `json:"t"`
	Url       *string          `json:"u"`
	UserAgent string
}

func Create(dp *depot.Depot, payload *CreatePayload) error {
	u, err := url.Parse(*payload.Url)
	if err != nil {
		return err
	}

	modelSite := &model.Site{}

	err = dp.Postgres().
		Model(&model.Site{}).
		Select(
			"has_events",
			"id",
			"safe_query_parameters",
		).
		Where("domain = ?", u.Hostname()).
		First(modelSite).
		Error
	if err != nil {
		return err
	}

	event := &model.Event{
		DateTime: payload.DateTime,
		Duration: *payload.Duration,
		Id:       payload.Id,
		IsBounce: *payload.Duration == 0,
		Kind:     *payload.Kind,
		Referrer: payload.Referrer,
		SiteId:   modelSite.Id,
	}

	event.FillVisitorId(dp, payload.IpAddress, payload.UserAgent)
	event.FillFromUrl(*payload.Url, modelSite.SafeQueryParameters)
	event.FillFromUserAgent(payload.UserAgent)

	if payload.Locale != nil {
		event.FillFromLocale(*payload.Locale)
	}

	if payload.TimeZone != nil {
		event.FillFromTimeZone(*payload.TimeZone)
	}

	err = dp.ClickHouse().
		Create(event).
		Error
	if err != nil {
		return err
	}

	if !modelSite.HasEvents {
		err = dp.Postgres().
			Model(&model.Site{}).
			Where("id = ?", modelSite.Id).
			Update("has_events", true).
			Error
		if err != nil {
			return err
		}
	}

	return nil
}

func ValidateCreatePayload(dp *depot.Depot, payload *CreatePayload) error {
	kinds := []string{model.EventKindPageView}

	errs := v.Validate(v.Schema{
		v.F("d", payload.Duration): v.All(
			v.Nonzero[*uint32]().Msg("This field is required."),
		),

		v.F("k", payload.Kind): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.InSlice(kinds, *t)
			}).Msg(fmt.Sprintf("This field should be one of these: %s", strings.Join(kinds, ", "))),
		),

		v.F("t", payload.TimeZone): v.Any(
			v.Zero[*string](),

			v.Is(func(t *string) bool {
				return validator.ClickhouseTimeZone(dp, *t)
			}),
		),

		v.F("u", payload.Url): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Is(func(t *string) bool {
				return validator.Url(*t)
			}).Msg("Please provide a valid URL."),

			v.Is(func(t *string) bool {
				return validator.SiteUrl(dp, *t)
			}).Msg("This site doesn't exist. Please add the site first."),
		),
	})

	if len(errs) > 0 {
		return errs
	}

	return nil
}
