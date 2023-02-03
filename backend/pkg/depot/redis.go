package depot

import (
	"fmt"

	"github.com/poeticmetric/poeticmetric/backend/pkg/env"
	"github.com/redis/go-redis/v9"
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
