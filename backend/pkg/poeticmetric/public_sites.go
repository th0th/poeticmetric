package poeticmetric

import (
	"gorm.io/gorm"
)

type PublicSiteResponse struct {
	Domain                          string `json:"domain"`
	ID                              uint   `json:"id"`
	GoogleSearchConsoleSiteURL      string `json:"-"`
	IsGoogleSearchConsoleSiteURLSet bool   `gorm:"-" json:"isGoogleSearchConsoleSiteURLSet"`
	Name                            string `json:"name"`
}

func (r *PublicSiteResponse) AfterFind(_ *gorm.DB) error {
	r.IsGoogleSearchConsoleSiteURLSet = r.GoogleSearchConsoleSiteURL != ""

	return nil
}

func (r *PublicSiteResponse) TableName() string {
	return "sites"
}
