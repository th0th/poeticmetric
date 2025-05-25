package poeticmetric

import (
	"encoding/json"

	"github.com/go-errors/errors"
)

type Optional[T any] struct {
	IsDefined bool
	Value     *T
}

func (o *Optional[T]) UnmarshalJSON(data []byte) error {
	o.IsDefined = true

	err := json.Unmarshal(data, &o.Value)
	if err != nil {
		return errors.Wrap(err, 0)
	}

	return nil
}
