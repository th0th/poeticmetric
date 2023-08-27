package model

import "time"

type Plan struct {
	CreatedAt         time.Time
	Id                uint
	MaxEventsPerMonth *uint
	MaxUsers          *uint
	Name              string
	StripeProductId   *string
	UpdatedAt         time.Time
}
