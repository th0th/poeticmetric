package validation

import (
	"context"

	v "github.com/RussellLuo/validating/v3"
	"github.com/RussellLuo/vext"
	"github.com/go-errors/errors"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) CreateEventParams(ctx context.Context, params *poeticmetric.CreateEventParams) error {
	validationErrs := v.Validate(v.Schema{
		v.F("i", params.ID): v.Any(
			v.Zero[string](),
			vext.UUIDv4().Msg("Invalid ID."),
		),

		v.F("k", params.Kind): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.In[string](poeticmetric.EventKinds()...).Msg("Invalid event kind."))
			}),
		),

		v.F("l", params.Locale): v.Any(
			v.Zero[*poeticmetric.EventKind](),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.In[string](poeticmetric.Locales()...).Msg("Invalid locale."))
			}),
		),

		v.F("u", params.URL): v.All(
			v.Nonzero[*string]().Msg("This field is required."),

			v.Nested(func(x *string) v.Validator {
				return v.Value(*x, v.All(
					vext.URL().Msg("Invalid URL."),

					s.siteURL(ctx).Msg("This site is not registered."),
				))
			}),
		),
	})
	if len(validationErrs) > 0 {
		return errors.Wrap(validationErrs, 0)
	}

	return nil
}
