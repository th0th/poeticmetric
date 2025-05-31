package env

import (
	"github.com/stripe/stripe-go/v82"
)

func (s *service) StripeAllowPromotionCodes() bool {
	return s.vars.StripeAllowPromotionCodes
}

func (s *service) ConfigureStripe() {
	if s.vars.StripeSecretKey != nil {
		stripe.Key = *s.vars.StripeSecretKey
	}
}

func (s *service) StripeMetaEnvironment() string {
	if s.vars.StripeMetaEnvironment != nil {
		return *s.vars.StripeMetaEnvironment
	}

	return ""
}

func (s *service) StripeWebhookSigningSecret() string {
	if s.vars.StripeWebhookSigningSecret != nil {
		return *s.vars.StripeWebhookSigningSecret
	}

	return ""
}
