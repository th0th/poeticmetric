package salt

import (
	"context"
	"errors"
	"time"

	"github.com/brianvoe/gofakeit/v6"
	"github.com/dchest/uniuri"
	"github.com/poeticmetric/poeticmetric/backend/pkg/depot"
	"github.com/redis/go-redis/v9"
)

type HashOrder int64

const (
	hashOrderKey = "hashOrder"
	saltKey      = "salt"
)

const (
	_ HashOrder = iota
	HashOrder1
	HashOrder2
	HashOrder3
	HashOrder4
	HashOrder5
	HashOrder6
)

func Get(dp *depot.Depot) string {
	ctx := context.Background()

	salt := dp.Redis().Get(ctx, saltKey).String()
	if salt == "" {
		salt = uniuri.NewLen(32)

		err := dp.Redis().
			Set(ctx, saltKey, salt, time.Until(time.Now().Add(24*time.Hour).Truncate(24*time.Hour))).
			Err()
		if err != nil {
			panic(err)
		}
	}

	return salt
}

func GetHashOrder(dp *depot.Depot) HashOrder {
	ctx := context.Background()

	hashOrder, err := dp.Redis().Get(ctx, hashOrderKey).Int64()
	if err != nil {
		if !errors.Is(err, redis.Nil) {
			panic(err)
		}
	}

	if hashOrder == 0 {
		hashOrder = int64(gofakeit.IntRange(1, 6))

		err = dp.Redis().
			Set(ctx, hashOrderKey, hashOrder, time.Until(time.Now().Add(24*time.Hour).Truncate(24*time.Hour))).
			Err()
		if err != nil {
			panic(err)
		}
	}

	return HashOrder(hashOrder)
}
