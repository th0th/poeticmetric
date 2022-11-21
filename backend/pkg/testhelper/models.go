package testhelper

import (
	"fmt"
	"github.com/brianvoe/gofakeit/v6"
	"github.com/google/uuid"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/poeticmetric/poeticmetric/backend/pkg/model"
)

func Organization(dp *depot.Depot, m *model.Organization) *model.Organization {
	if m == nil {
		m = &model.Organization{}
	}

	if m.PlanId == 0 {
		modelPlan := Plan(dp, nil)
		m.PlanId = modelPlan.Id
	}

	return m
}

func Plan(dp *depot.Depot, m *model.Plan) *model.Plan {
	if m == nil {
		m = &model.Plan{}
	}

	if m.Name == "" {
		m.Name = fmt.Sprintf("%s-%s", uuid.NewString(), gofakeit.Word())
	}

	err := dp.Postgres().
		Create(m).
		Error
	if err != nil {
		panic(err)
	}

	return m
}

func Site(dp *depot.Depot, m *model.Site) *model.Site {
	if m == nil {
		m = &model.Site{}
	}

	if m.OrganizationId == 0 {
		modelOrganization := Organization(dp, nil)
		m.OrganizationId = modelOrganization.Id
	}

	return m
}
