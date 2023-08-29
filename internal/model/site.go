package model

import (
	"time"

	"github.com/lib/pq"
)

type Site struct {
	CreatedAt                  time.Time
	Domain                     string
	GoogleSearchConsoleSiteUrl *string
	HasEvents                  bool
	Id                         uint
	IsPublic                   bool
	Name                       string
	Organization               Organization
	OrganizationId             uint
	SafeQueryParameters        pq.StringArray `gorm:"type:text[]"`
	UpdatedAt                  time.Time
}

const (
	SiteNameMaxLength = 50
	SiteNameMinLength = 1
)
