package depot

import (
	"context"
	"net/http"

	"github.com/poeticmetric/poeticmetric/backend/pkg/depot/rabbitmq"
	"github.com/redis/go-redis/v9"
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
