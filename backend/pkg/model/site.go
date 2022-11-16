package model

import "time"

type Site struct {
	CreatedAt      time.Time `gorm:"not null"`
	Domain         string    `gorm:"not null;uniqueIndex"`
	Id             uint64
	Name           string
	Organization   Organization `gorm:"constraint:OnDelete:CASCADE"`
	OrganizationId uint64       `gorm:"not null"`
	UpdatedAt      time.Time    `gorm:"not null"`
}

const (
	SiteNameMaxLength = 50
	SiteNameMinLength = 1
)
