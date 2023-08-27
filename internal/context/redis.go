package context

import (
	"context"

	"github.com/redis/go-redis/v9"

	"github.com/th0th/poeticmetric/internal/env"
)

const redisKey = "redis"

func Rd(ctx context.Context) *redis.Client {
	v := ctx.Value(redisKey)

	if v == nil {
		rd := redis.NewClient(&redis.Options{
			Addr:     env.GetRedisAddr(),
			Password: env.Get().RedisPassword,
		})

		ctx = context.WithValue(ctx, redisKey, rd)
	}

	return ctx.Value(redisKey).(*redis.Client)
}
