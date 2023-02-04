package organization

import (
	"time"

	"github.com/th0th/poeticmetric/backend/pkg/model"
	"github.com/th0th/poeticmetric/backend/pkg/service/plan"
)

type Organization struct {
	CreatedAt          time.Time                             `json:"createdAt"`
	Id                 uint64                                `json:"id"`
	IsOnTrial          bool                                  `json:"isOnTrial"`
	Name               string                                `json:"name"`
	Plan               *plan.Plan                            `gorm:"embedded;embeddedPrefix:plan__" json:"plan"`
	StripeCustomerId   *string                               `json:"stripeCustomerId"`
	SubscriptionPeriod *model.OrganizationSubscriptionPeriod `json:"subscriptionPeriod"`
	TrialEndsAt        *time.Time                            `json:"trialEndsAt"`
	UpdatedAt          time.Time                             `json:"updatedAt"`
}
