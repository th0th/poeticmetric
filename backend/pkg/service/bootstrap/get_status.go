package bootstrap

import (
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

type Status struct {
	IsReady bool `json:"isReady"`
}

func GetStatus(dp *depot.Depot) (*Status, error) {
	status := &Status{}

	// plan
	var planCount int64

	err := dp.Postgres().
		Model(&model.Plan{}).
		Count(&planCount).
		Error
	if err != nil {
		return nil, err
	}

	if planCount > 0 {
		return status, nil
	}

	// organization
	var organizationCount int64

	err = dp.Postgres().
		Model(&model.Organization{}).
		Count(&organizationCount).
		Error
	if err != nil {
		return nil, err
	}

	if organizationCount > 0 {
		return status, nil
	}

	// user
	var userCount int64

	err = dp.Postgres().
		Model(&model.User{}).
		Count(&userCount).
		Error
	if err != nil {
		return nil, err
	}

	if userCount > 0 {
		return status, nil
	}

	status.IsReady = true

	return status, nil
}
