package site

import (
	"github.com/lib/pq"
	"time"
)

type Site struct {
	CreatedAt           time.Time      `json:"createdAt"`
	Domain              string         `json:"domain"`
	Id                  uint64         `json:"id"`
	Name                string         `json:"name"`
	SafeQueryParameters pq.StringArray `json:"safeQueryParameters" gorm:"type:text[]"`
	UpdatedAt           time.Time      `json:"updatedAt"`
}
