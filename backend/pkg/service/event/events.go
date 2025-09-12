package event

import (
	"context"
	"net/url"

	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func (s *service) Create(ctx context.Context, params *poeticmetric.CreateEventParams) error {
	postgres := poeticmetric.ServicePostgres(ctx, s)

	URL, err := url.Parse(*params.URL)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	site := poeticmetric.Site{}
	err = postgres.
		Select("HasEvents", "ID", "OrganizationID", "SafeQueryParameters").
		First(&site, poeticmetric.Site{Domain: URL.Hostname()}).
		Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.Wrap(poeticmetric.ErrNotFound, 0)
		}

		return errors.Wrap(err, 0)
	}

	event := poeticmetric.Event{
		DateTime:        params.DateTime,
		DurationSeconds: *params.DurationSeconds,
		ID:              params.ID,
		Kind:            *params.Kind,
		Locale:          params.Locale,
		Referrer:        params.Referrer,
		SiteID:          site.ID,
		TimeZone:        params.TimeZone,
		URL:             *params.URL,
		UserAgent:       params.UserAgent,
	}

	organizationSalt, err := s.OrganizationSalt(ctx, site.OrganizationID)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = event.Fill(params.IPAddress, organizationSalt, site.SafeQueryParameters)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	err = s.clickHouse.Create(&event).Error
	if err != nil {
		return errors.Wrap(err, 0)
	}

	if !site.HasEvents {
		err = postgres.Model(&site).UpdateColumn("HasEvents", true).Error
		if err != nil {
			return errors.Wrap(err, 0)
		}
	}

	return nil
}
