package poeticmetric

import (
	"context"
	"time"
)

type OrganizationSite struct {
	CreatedAt                  time.Time `json:"createdAt"`
	Domain                     string    `json:"domain"`
	GoogleSearchConsoleSiteUrl *string   `json:"googleSearchConsoleSiteUrl"`
	HasEvents                  bool      `json:"hasEvents"`
	ID                         uint      `json:"ID"`
	IsPublic                   bool      `json:"isPublic"`
	Name                       string    `json:"name"`
	SafeQueryParameters        []string  `gorm:"serializer:json" json:"safeQueryParameters"`
	UpdatedAt                  time.Time `json:"updatedAt"`
}

type SiteService interface {
	ServiceWithPostgres

	ListOrganizationSites(ctx context.Context, organizationID uint) ([]*OrganizationSite, error)
}
