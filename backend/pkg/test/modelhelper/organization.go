package modelhelper

import (
	"testing"

	"github.com/brianvoe/gofakeit/v7"
	"github.com/go-errors/errors"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func Organization(t *testing.T, pg *gorm.DB, m *poeticmetric.Organization) {
	err := pg.Transaction(func(pg2 *gorm.DB) error {
		fillOrganization(t, pg2, m)

		err2 := pg2.Create(m).Error
		if err2 != nil {
			return errors.Wrap(err2, 0)
		}

		return nil
	})
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}
}

func fillOrganization(t *testing.T, pg *gorm.DB, m *poeticmetric.Organization) {
	err := pg.Transaction(func(pg2 *gorm.DB) error {
		if m.PlanID == 0 {
			plan := poeticmetric.Plan{}
			Plan(t, pg2, &plan)
			m.PlanID = plan.ID
		}

		if m.Name == "" {
			m.Name = gofakeit.Word()
		}

		return nil
	})
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}
}
