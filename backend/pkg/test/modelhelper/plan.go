package modelhelper

import (
	"testing"

	"github.com/go-errors/errors"
	"github.com/google/uuid"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func Plan(t *testing.T, pg *gorm.DB, m *poeticmetric.Plan) {
	fillPlan(t, pg, m)

	err := pg.Create(&m).Error
	if err != nil {
		t.Fatal(errors.Wrap(err, 0))
	}
}

func fillPlan(t *testing.T, pg *gorm.DB, m *poeticmetric.Plan) {
	if m.Name == "" {
		m.Name = uuid.NewString()
	}
}

