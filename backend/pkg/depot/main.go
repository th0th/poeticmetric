package depot

import (
	"context"
	"net/http"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/depot/rabbitmq"
)

var Ctx = context.Background()

type Depot struct {
	_parent    *Depot
	clickHouse *gorm.DB
	httpClient *http.Client
	postgres   *gorm.DB
	rabbitMq   *rabbitmq.RabbitMq
	redis      *redis.Client
}

func New() *Depot {
	return &Depot{}
}
