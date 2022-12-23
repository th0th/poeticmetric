package model

import "time"

const (
	OrganizationDeletionDetailsMaxLength = 1000
	OrganizationDeletionDetailsMinLength = 2

	OrganizationDeletionReasonMaxLength = 400
	OrganizationDeletionReasonMinLength = 2
)

type OrganizationDeletion struct {
	DateTime                     time.Time
	Details                      *string
	Id                           uint64
	OrganizationCreatedAt        time.Time
	OrganizationId               uint64
	OrganizationName             string
	OrganizationPlanName         string
	OrganizationStripeCustomerId *string
	Reason                       string
	UserEmail                    string
	UserId                       uint64
	UserName                     string
}
