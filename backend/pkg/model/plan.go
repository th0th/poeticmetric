package model

import "time"

type Plan struct {
	CreatedAt                time.Time `gorm:"not null"`
	Id                       uint64    `gorm:"primaryKey"`
	IsLiveChatSupportEnabled bool      `gorm:"not null"`
	MaxEventsPerMonth        *uint64
	MaxUsers                 *uint64
	Name                     string
	StripeProductId          *string
	UpdatedAt                time.Time `gorm:"not null"`
}
