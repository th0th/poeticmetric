package validator

import (
	"net/url"

	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func SiteUrl(dp *depot.Depot, v string) bool {
	u, err := url.Parse(v)
	if err != nil {
		return false
	}

	var count int64

	err = dp.Postgres().
		Model(&model.Site{}).
		Where("domain = ?", u.Hostname()).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
