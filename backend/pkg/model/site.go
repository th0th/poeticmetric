package model

import (
	"time"

	"github.com/lib/pq"
)

type Site struct {
	CreatedAt           time.Time
	Domain              string
	HasEvents           bool
	Id                  uint64
	IsPublic            bool
	Name                string
	Organization        Organization `gorm:"constraint:OnDelete:CASCADE"`
	OrganizationId      uint64
	SafeQueryParameters pq.StringArray `gorm:"type:text[]"`
	UpdatedAt           time.Time
}

const (
	SiteNameMaxLength = 50
	SiteNameMinLength = 1
)
