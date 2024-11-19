package poeticmetric

import (
	"context"
	"time"
)

type CreateSiteParams struct {
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
	ID                         uint      `json:"ID"`
	IsPublic                   bool      `json:"isPublic"`
	Name                       string    `json:"name"`
	SafeQueryParameters        []string  `gorm:"serializer:json" json:"safeQueryParameters"`
	UpdatedAt                  time.Time `json:"updatedAt"`
}

type SiteService interface {
	ServiceWithPostgres

	Create(ctx context.Context, organizationID uint, params *CreateSiteParams) (*OrganizationSite, error)
	List(ctx context.Context, organizationID uint) ([]*OrganizationSite, error)
}
