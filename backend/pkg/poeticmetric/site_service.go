package poeticmetric

import (
	"context"
	"time"
)

type CreateOrganizationSiteParams struct {
	Domain                     *string  `json:"domain"`
	GoogleSearchConsoleSiteURL *string  `json:"googleSearchConsoleSiteURL"`
	IsPublic                   *bool    `json:"isPublic"`
	Name                       *string  `json:"name"`
	SafeQueryParameters        []string `gorm:"serializer:json" json:"safeQueryParameters"`
}

type OrganizationSite struct {
	CreatedAt                  time.Time `json:"createdAt"`
	Domain                     string    `json:"domain"`
	GoogleSearchConsoleSiteUrl *string   `json:"googleSearchConsoleSiteURL"`
	HasEvents                  bool      `json:"hasEvents"`
	ID                         uint      `json:"id"`
	IsPublic                   bool      `json:"isPublic"`
	Name                       string    `json:"name"`
	SafeQueryParameters        []string  `gorm:"serializer:json" json:"safeQueryParameters"`
	UpdatedAt                  time.Time `json:"updatedAt"`
}

type SiteService interface {
	ServiceWithPostgres

	CreateOrganizationSite(ctx context.Context, organizationID uint, params *CreateOrganizationSiteParams) (*OrganizationSite, error)
	ListOrganizationSites(ctx context.Context, organizationID uint) ([]*OrganizationSite, error)
	ReadOrganizationSite(ctx context.Context, organizationID uint, siteID uint) (*OrganizationSite, error)
}
