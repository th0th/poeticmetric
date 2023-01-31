package depot

import (
	"fmt"

	"github.com/go-redis/redis/v9"
	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
)

func (dp *Depot) Redis() *redis.Client {
	if dp.redis == nil {
		dp.redis = redis.NewClient(&redis.Options{
			Addr:     fmt.Sprintf("%s:%s", env.Get(env.RedisHost), env.Get(env.RedisPort)),
			Password: env.Get(env.RedisPassword),
		})
	}

	return dp.redis
}
