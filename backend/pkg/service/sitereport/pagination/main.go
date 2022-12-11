package pagination

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"strings"
)

const Size = 10

func SerializePaginationCursor(paginationCursor any) ([]byte, error) {
	d, err := json.Marshal(paginationCursor)
	if err != nil {
		return nil, err
	}

	serializedPaginationCursor := base64.StdEncoding.EncodeToString(d)

	return []byte(fmt.Sprintf(`"%s"`, serializedPaginationCursor)), nil
}

func DeserializePaginationCursor(paginationCursor any, data []byte) error {
	serializedPaginationCursor := strings.TrimPrefix(strings.TrimSuffix(string(data), `"`), `"`)

	jsonByteSlice, err := base64.StdEncoding.DecodeString(serializedPaginationCursor)
	if err != nil {
		return err
	}

	return json.Unmarshal(jsonByteSlice, paginationCursor)
}
