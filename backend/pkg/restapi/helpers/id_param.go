package helpers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
)

const (
	maxId uint64 = 9223372036854775807
)

var (
	ErrInvalid = errors.New("invalid parameter")
)

func IdParam(c *fiber.Ctx, key string) (id uint64, err error) {
	intId, err := c.ParamsInt(key)
	if err != nil {
		return 0, err
	}

	if intId < 1 || intId > int(maxId) {
		return 0, ErrInvalid
	}

	return uint64(intId), nil
}
