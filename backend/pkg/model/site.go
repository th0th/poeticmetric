package model

import (
	"github.com/lib/pq"
	"time"
)

type Site struct {
	CreatedAt           time.Time
	Domain              string
	Id                  uint64
	Name                string
	Organization        Organization `gorm:"constraint:OnDelete:CASCADE"`
	OrganizationId      uint64
	SafeQueryParameters pq.StringArray `gorm:"type:text[]"`
	UpdatedAt           time.Time      `gorm:"not null"`
}

const (
	SiteNameMaxLength = 50
	SiteNameMinLength = 1
)
