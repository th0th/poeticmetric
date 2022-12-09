package pagination

import (
	"encoding/base64"
	"encoding/json"
	"github.com/poeticmetric/poeticmetric/backend/pkg/pointer"
)

func GetPaginationCursor[T any](v any) *string {
	vByteSlice, err := json.Marshal(v)
	if err != nil {
		panic(err)
	}

	var paginationCursorSlice []T

	err = json.Unmarshal(vByteSlice, &paginationCursorSlice)
	if err != nil {
		panic(err)
	}

	if len(paginationCursorSlice) < 1 {
		return nil
	}

	paginationCursor := paginationCursorSlice[len(paginationCursorSlice)-1:][0]
	paginationCursorByteSlice, err := json.Marshal(paginationCursor)

	return pointer.Get(base64.StdEncoding.EncodeToString(paginationCursorByteSlice))
}
