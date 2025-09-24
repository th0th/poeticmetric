package poeticmetric

import (
	"context"
	"time"
)

const (
	LogKindSignUp                          LogKind = "SIGN_UP"
	LogKindUnverifiedOrganizationsDeletion LogKind = "UNVERIFIED_ORGANIZATIONS_DELETION"
)

type LogService interface {
	ServiceWithPostgres

	SignUp(ctx context.Context, data *SignUpLogData) error
	UnverifiedOrganizationsDeletion(ctx context.Context, data *UnverifiedOrganizationsDeletionLogData) error
}

type Log struct {
	Data     any `gorm:"serializer:json"`
	DateTime time.Time
	ID       uint
	Kind     LogKind
}

type LogKind string

type UnverifiedOrganizationsDeletionLogData []UnverifiedOrganizationsDeletionLogDatum

type UnverifiedOrganizationsDeletionLogDatum struct {
	OrganizationCreatedAt        time.Time  `json:"organizationCreatedAt"`
	OrganizationID               uint       `json:"organizationID"`
	OrganizationName             string     `json:"organizationName"`
	OrganizationUpdatedAt        time.Time  `json:"organizationUpdatedAt"`
	UserCreatedAt                time.Time  `json:"userCreatedAt"`
	UserEmail                    string     `json:"userEmail"`
	UserID                       uint       `json:"userID"`
	UserLastAccessTokenCreatedAt *time.Time `json:"userLastAccessTokenCreatedAt"`
	UserName                     string     `json:"userName"`
	UserUpdatedAt                time.Time  `json:"userUpdatedAt"`
}

type SignUpLogData struct {
	DateTime             time.Time `json:"dateTime"`
	OrganizationID       uint      `json:"organizationID"`
	OrganizationName     string    `json:"organizationName"`
	OrganizationTimeZone string    `json:"organizationTimeZone"`
	UserEmail            string    `json:"userEmail"`
	UserID               uint      `json:"userID"`
	UserName             string    `json:"userName"`
}
