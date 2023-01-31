package depot

import (
	"context"
	"net/http"

	"github.com/go-redis/redis/v9"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"gorm.io/gorm"
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
