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

	var planCount int64

	err := dp.Postgres().
		Model(&model.Plan{}).
		Count(&planCount).
		Error
	if err != nil {
		return nil, err
	}

	status.IsReady = planCount == 0

	return status, nil
}
