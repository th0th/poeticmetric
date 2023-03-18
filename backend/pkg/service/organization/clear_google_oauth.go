package organization

import (
	"github.com/go-errors/errors"
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func ClearGoogleAuth(dp *depot.Depot, organizationId uint64) (*Organization, error) {
	err := dp.WithPostgresTransaction(func(dp2 *depot.Depot) error {
		err2 := dp2.Postgres().
			Model(&model.Site{}).
			Where("organization_id = ?", organizationId).
			Where("google_search_console_site_url is not null").
			Update("google_search_console_site_url", nil).
			Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		err2 = dp2.Postgres().
			Model(&model.Organization{}).
			Where("id = ?", organizationId).
			Update("google_oauth_refresh_token", nil).
			Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		return nil, err
	}

	return Read(dp, organizationId)
}
