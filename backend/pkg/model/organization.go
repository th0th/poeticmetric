package model

import "time"

const (
	OrganizationNameMaxLength                                          = 70
	OrganizationNameMinLength                                          = 2
	OrganizationSubscriptionPeriodMonth OrganizationSubscriptionPeriod = "MONTH"
	OrganizationSubscriptionPeriodYear  OrganizationSubscriptionPeriod = "YEAR"
)

type OrganizationSubscriptionPeriod string

type Organization struct {
	CreatedAt               time.Time
	GoogleOauthRefreshToken *string
	Id                      uint64
	IsOnTrial               bool
	Name                    string
	Plan                    *Plan
	PlanId                  *uint64
	StripeCustomerId        *string
	SubscriptionPeriod      *OrganizationSubscriptionPeriod
	TrialEndsAt             *time.Time
	UpdatedAt               time.Time
}
