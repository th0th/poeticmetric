package model

import "time"

type OrganizationSubscriptionPeriod = string

type Organization struct {
	CreatedAt               time.Time
	GoogleOauthRefreshToken *string
	Id                      uint
	IsOnTrial               bool
	Name                    string
	Plan                    *Plan
	PlanId                  *uint
	StripeCustomerId        *string
	SubscriptionPeriod      *OrganizationSubscriptionPeriod
	TrialEndsAt             *time.Time
	UpdatedAt               time.Time
}

const (
	OrganizationNameMaxLength                                          = 70
	OrganizationNameMinLength                                          = 2
	OrganizationSubscriptionPeriodMonth OrganizationSubscriptionPeriod = "MONTH"
	OrganizationSubscriptionPeriodYear  OrganizationSubscriptionPeriod = "YEAR"
)
