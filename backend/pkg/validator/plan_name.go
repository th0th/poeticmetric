package validator

import (
	"github.com/th0th/poeticmetric/backend/pkg/depot"
	"github.com/th0th/poeticmetric/backend/pkg/model"
)

func PlanName(dp *depot.Depot, v string) bool {
	var count int64

	modelPlan := &model.Plan{}

	err := dp.Postgres().
		Model(modelPlan).
		Where("name = ?", v).
		Limit(1).
		Count(&count).
		Error
	if err != nil {
		panic(err)
	}

	return count == 1
}
