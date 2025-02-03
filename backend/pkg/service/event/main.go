package event

import (
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	ClickHouse *gorm.DB
}

type service struct {
	clickHouse *gorm.DB
}

func New(params NewParams) poeticmetric.EventService {
	return &service{
		clickHouse: params.ClickHouse,
	}
}
