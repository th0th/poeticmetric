package site

import (
	"context"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/now"
	"github.com/stretchr/testify/assert"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/test/sqlmockhelper"
)

func TestNew(t *testing.T) {
	postgres := &gorm.DB{}

	type args struct {
		params NewParams
	}
	tests := []struct {
		name string
		args args
		want poeticmetric.SiteService
	}{
		{
			name: "successful",
			args: args{
				params: NewParams{
					Postgres: postgres,
				},
			},
			want: &service{
				postgres: postgres,
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := New(tt.args.params)
			assert.Equal(t, tt.want, got)
		})
	}
}

func Test_service_ListOrganizationSites(t *testing.T) {
	db, sqlMock, err := sqlmock.New(
		sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual),
		sqlmock.ValueConverterOption(sqlmockhelper.CustomConverter{}),
	)
	if err != nil {
		t.Fatal(err)
	}

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	if err != nil {
		t.Fatal(err)
	}

	// language=postgresql
	selectQuery := `SELECT "sites"."created_at","sites"."domain","sites"."google_search_console_site_url","sites"."has_events","sites"."id","sites"."is_public","sites"."name","sites"."safe_query_parameters","sites"."updated_at" FROM "sites" WHERE "sites"."organization_id" = $1`

	type fields struct {
		postgres *gorm.DB
	}
	type args struct {
		ctx            context.Context
		organizationID uint
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func()
		want    []*poeticmetric.OrganizationSite
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "success",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:            context.Background(),
				organizationID: 1,
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs(uint(1)).
					WillReturnRows(
						sqlMock.NewRows([]string{
							"id",
							"name",
							"domain",
							"google_search_console_site_url",
							"has_events",
							"is_public",
							"safe_query_parameters",
							"created_at",
							"updated_at",
						}).AddRow(
							1,
							"random name",
							"www.domain.tld",
							nil,
							true,
							false,
							[]string{},
							now.MustParse("2024-01-01T00:00:00Z"),
							now.MustParse("2024-01-02T00:00:00Z"),
						),
					)
			},
			want: []*poeticmetric.OrganizationSite{
				{
					ID:                         1,
					Name:                       "random name",
					Domain:                     "www.domain.tld",
					GoogleSearchConsoleSiteUrl: nil,
					HasEvents:                  true,
					IsPublic:                   false,
					SafeQueryParameters:        []string{},
					CreatedAt:                  now.MustParse("2024-01-01T00:00:00Z"),
					UpdatedAt:                  now.MustParse("2024-01-02T00:00:00Z"),
				},
			},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				postgres: tt.fields.postgres,
			}

			tt.setup()

			got, err2 := s.ListOrganizationSites(tt.args.ctx, tt.args.organizationID)
			tt.wantErr(t, err2)
			assert.Equal(t, tt.want, got)
			assert.NoError(t, sqlMock.ExpectationsWereMet())
		})
	}
}
