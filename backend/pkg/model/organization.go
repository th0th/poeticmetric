package model

import "time"

type OrganizationSubscriptionPeriod string

type Organization struct {
	CreatedAt          time.Time `gorm:"not null"`
	Id                 uint64
	IsOnTrial          bool `gorm:"not null"`
	Name               string
	Plan               *Plan `gorm:"constraint:OnDelete:CASCADE"`
	PlanId             uint64
	StripeCustomerId   *string
	SubscriptionPeriod *string
	TrialEndsAt        *time.Time
	UpdatedAt          time.Time `gorm:"not null"`
}

const (
	OrganizationSubscriptionPeriodMonth OrganizationSubscriptionPeriod = "MONTH"
	OrganizationSubscriptionPeriodYear  OrganizationSubscriptionPeriod = "YEAR"

	OrganizationNameMinLength = 2
	OrganizationNameMaxLength = 70
)
