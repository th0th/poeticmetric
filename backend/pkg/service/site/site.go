package site

import (
	"time"

	"github.com/lib/pq"
)

type Site struct {
	CreatedAt           time.Time      `json:"createdAt"`
	Domain              string         `json:"domain"`
	HasEvents           bool           `json:"hasEvents"`
	Id                  uint64         `json:"id"`
	IsPublic            bool           `json:"isPublic"`
	Name                string         `json:"name"`
	SafeQueryParameters pq.StringArray `json:"safeQueryParameters" gorm:"type:text[]"`
	UpdatedAt           time.Time      `json:"updatedAt"`
}
