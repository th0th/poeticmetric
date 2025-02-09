package event

import (
	"context"
	"fmt"
	"time"

	"github.com/dchest/uniuri"
	"github.com/go-errors/errors"
	"github.com/jinzhu/now"
	"github.com/valkey-io/valkey-go"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) OrganizationSalt(ctx context.Context, organizationID uint) (string, error) {
	organizationSalt, err := s.valkey.Do(
		ctx,
		s.valkey.B().Get().Key(fmt.Sprintf("organization:%d:salt", organizationID)).Build(),
	).ToString()
	if err != nil {
		if valkey.IsValkeyNil(err) {
			postgres := poeticmetric.ServicePostgres(ctx, s)

			organization := poeticmetric.Organization{}
			err = postgres.Select("TimeZone").First(&organization, poeticmetric.Organization{ID: organizationID}, "ID").Error
			if err != nil {
				return "", errors.Wrap(err, 0)
			}

			var location *time.Location
			location, err = time.LoadLocation(organization.TimeZone)
			if err != nil {
				return "", errors.Wrap(err, 0)
			}
			tomorrow := now.With(time.Now().In(location)).BeginningOfDay().Add(24 * time.Hour)

			organizationSalt = uniuri.NewLen(36)
			err = s.valkey.Do(
				ctx,
				s.valkey.B().Set().Key(fmt.Sprintf("organization:%d:salt", organizationID)).Value(organizationSalt).Exat(tomorrow).Build(),
			).Error()
			if err != nil {
				return "", errors.Wrap(err, 0)
			}
		} else {
			return "", errors.Wrap(err, 0)
		}
	}

	return organizationSalt, nil
}
