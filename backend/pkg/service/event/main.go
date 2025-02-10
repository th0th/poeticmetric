package event

import (
	"github.com/valkey-io/valkey-go"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

type NewParams struct {
	ClickHouse *gorm.DB
	Postgres   *gorm.DB
	Valkey     valkey.Client
}

type service struct {
	clickHouse *gorm.DB
	postgres   *gorm.DB
	valkey     valkey.Client
}

func New(params NewParams) poeticmetric.EventService {
	return &service{
		clickHouse: params.ClickHouse,
		postgres:   params.Postgres,
		valkey:     params.Valkey,
	}
}

func (s *service) Postgres() *gorm.DB {
	return s.postgres
}
