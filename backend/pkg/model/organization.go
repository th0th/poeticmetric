package model

import "time"

const (
	OrganizationSubscriptionPeriodMonth OrganizationSubscriptionPeriod = "MONTH"
	OrganizationSubscriptionPeriodYear  OrganizationSubscriptionPeriod = "YEAR"

	OrganizationNameMinLength = 2
	OrganizationNameMaxLength = 70
)

type OrganizationSubscriptionPeriod string

type Organization struct {
	CreatedAt          time.Time
	Id                 uint64
	IsOnTrial          bool
	Name               string
	Plan               *Plan
	PlanId             uint64
	StripeCustomerId   *string
	SubscriptionPeriod *string
	TrialEndsAt        *time.Time
	UpdatedAt          time.Time
}
