package testconfig

import (
	"os"
)

func Debug() bool {
	return os.Getenv("TEST_DEBUG") == "true"
}
