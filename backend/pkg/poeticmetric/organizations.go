package poeticmetric

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type OrganizationService interface {
	ServiceWithPostgres

	ChangePlan(ctx context.Context, organizationID uint, request *ChangePlanRequest) (*ChangePlanResponse, error)
	CreateStripeBillingPortalSession(ctx context.Context, organizationID uint) (*CreateStripeBillingPortalSessionResponse, error)
	DeleteOrganization(ctx context.Context, organizationID uint, request *OrganizationDeletionRequest) error
	DeleteUnverifiedOrganizations(ctx context.Context) error
	ListOrganizationDeletionReasons(ctx context.Context) ([]*OrganizationDeletionReason, error)
	ReadOrganization(ctx context.Context, organizationID uint) (*OrganizationResponse, error)
	ReadOrganizationUsage(ctx context.Context, organizationID uint) (*OrganizationUsageResponse, error)
	ReadPlan(ctx context.Context, planID uint) (*PlanResponse, error)
	UpdateOrganization(ctx context.Context, organizationID uint, request *UpdateOrganizationRequest) error
	UpdateOrganizationSubscription(ctx context.Context, request *UpdateOrganizationSubscriptionRequest) error
}

type ChangePlanRequest struct {
	MaxEventsPerMonth  *int    `json:"maxEventsPerMonth"`
	PlanName           *string `json:"planName"`
	SubscriptionPeriod *string `json:"subscriptionPeriod"`
}

type ChangePlanResponse struct {
	RedirectUrl string `json:"redirectUrl"`
}

type CreateStripeBillingPortalSessionResponse struct {
	RedirectUrl string `json:"redirectUrl"`
}

type OrganizationDeletionReason struct {
	DetailTitle *string `json:"detailTitle"`
	Order       int     `json:"order"`
	Reason      string  `json:"reason"`
}

type OrganizationDeletionRequest struct {
	Detail *string `json:"detail"`
	Reason *string `json:"reason"`
}

type OrganizationResponse struct {
	CreatedAt                     time.Time  `json:"createdAt"`
	IsOnTrial                     bool       `json:"isOnTrial"`
	IsStripeCustomer              bool       `gorm:"-" json:"isStripeCustomer"`
	Name                          string     `json:"name"`
	StripeCustomerID              *string    `json:"-"`
	SubscriptionCancelAtPeriodEnd *bool      `json:"subscriptionCancelAtPeriodEnd"`
	SubscriptionPeriod            *string    `json:"subscriptionPeriod"`
	TrialEndsAt                   *time.Time `json:"trialEndsAt"`
	UpdatedAt                     time.Time  `json:"updatedAt"`
}

type OrganizationUsageResponse struct {
	MaxSiteCount int `json:"maxSiteCount"`
	MaxUserCount int `json:"maxUserCount"`
	SiteCount    int `json:"siteCount"`
	UserCount    int `json:"userCount"`
}

type PlanResponse struct {
	MaxEventsPerMonth int    `json:"maxEventsPerMonth"`
	MaxSiteCount      int    `json:"maxSiteCount"`
	MaxUserCount      int    `json:"maxUserCount"`
	Name              string `json:"name"`
}

type UpdateOrganizationRequest struct {
	Name *string `json:"name"`
}

type UpdateOrganizationSubscriptionRequest struct {
	StripeSubscriptionID *string
}

func (r *OrganizationResponse) AfterFind(_ *gorm.DB) error {
	r.IsStripeCustomer = r.StripeCustomerID != nil

	return nil
}

func (r *OrganizationResponse) TableName() string {
	return "organizations"
}
