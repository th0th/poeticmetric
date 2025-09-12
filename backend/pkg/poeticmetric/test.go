package poeticmetric

import (
	"sync"

	"github.com/testcontainers/testcontainers-go"
	govalkey "github.com/valkey-io/valkey-go"
	"gorm.io/gorm"
)

type TestPostgres struct {
	Container testcontainers.Container
	DB        *gorm.DB
	Once      sync.Once
}

type TestValkey struct {
	Container testcontainers.Container
	Client    govalkey.Client
	Once      sync.Once
}
