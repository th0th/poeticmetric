package site

import (
	"context"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jinzhu/now"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/test/sqlmockhelper"
)

func TestNew(t *testing.T) {
	postgres := &gorm.DB{}
	mockValidationService := &poeticmetric.ValidationServiceMock{}

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
					Postgres:          postgres,
					ValidationService: mockValidationService,
				},
			},
			want: &service{
				postgres:          postgres,
				validationService: mockValidationService,
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

func Test_service_Create(t *testing.T) {
	db, sqlMock, err := sqlmock.New(
		sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual),
		sqlmock.ValueConverterOption(sqlmockhelper.CustomConverter{}),
	)
	if err != nil {
		t.Fatal(err)
	}
	postgres, err := gorm.Open(gormpostgres.New(gormpostgres.Config{Conn: db}), &gorm.Config{})
	if err != nil {
		t.Fatal(err)
	}

	mockValidationService := &poeticmetric.ValidationServiceMock{}

	// language=postgresql
	insertQuery := `INSERT INTO "sites" ("created_at","domain","google_search_console_site_url","has_events","is_public","name","organization_id","safe_query_parameters","updated_at") VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING "id"`

	type fields struct {
		postgres          *gorm.DB
		validationService poeticmetric.ValidationService
	}
	type args struct {
		ctx            context.Context
		organizationID uint
		params         *poeticmetric.CreateSiteParams
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func()
		want    *poeticmetric.OrganizationSite
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "success",
			fields: fields{
				postgres:          postgres,
				validationService: mockValidationService,
			},
			args: args{
				ctx:            context.Background(),
				organizationID: 1,
				params: &poeticmetric.CreateSiteParams{
					Domain:              poeticmetric.Pointer("www.domain.tld"),
					IsPublic:            poeticmetric.Pointer(true),
					Name:                poeticmetric.Pointer("random name"),
					SafeQueryParameters: []string{},
				},
			},
			setup: func() {
				mockValidationService.On("CreateSiteParams", mock.Anything, uint(1), mock.Anything).Return(nil)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), "www.domain.tld", sqlmock.AnyArg(), false, true, "random name", uint(1), sqlmock.AnyArg(), sqlmock.AnyArg()).
					WillReturnRows(sqlMock.NewRows([]string{"id"}).AddRow(1))
				sqlMock.ExpectCommit()
			},
			want: &poeticmetric.OrganizationSite{
				Domain:                     "www.domain.tld",
				GoogleSearchConsoleSiteUrl: nil,
				HasEvents:                  false,
				ID:                         1,
				IsPublic:                   true,
				Name:                       "random name",
				SafeQueryParameters:        []string{},
			},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				postgres:          tt.fields.postgres,
				validationService: tt.fields.validationService,
			}

			tt.setup()

			got, gotErr := s.Create(tt.args.ctx, tt.args.organizationID, tt.args.params)
			tt.wantErr(t, gotErr)

			assert.Equal(t, tt.want.Domain, got.Domain)
			assert.Equal(t, tt.want.GoogleSearchConsoleSiteUrl, got.GoogleSearchConsoleSiteUrl)
			assert.Equal(t, tt.want.HasEvents, got.HasEvents)
			assert.Equal(t, tt.want.ID, got.ID)
			assert.Equal(t, tt.want.IsPublic, got.IsPublic)
			assert.Equal(t, tt.want.Name, got.Name)
			assert.Equal(t, tt.want.SafeQueryParameters, got.SafeQueryParameters)

			assert.NoError(t, sqlMock.ExpectationsWereMet())
		})
	}
}

func Test_service_List(t *testing.T) {
	db, sqlMock, err := sqlmock.New(
		sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual),
		sqlmock.ValueConverterOption(sqlmockhelper.CustomConverter{}),
	)
	if err != nil {
		t.Fatal(err)
	}

	postgres, err := gorm.Open(gormpostgres.New(gormpostgres.Config{Conn: db}), &gorm.Config{})
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

			got, err2 := s.List(tt.args.ctx, tt.args.organizationID)
			tt.wantErr(t, err2)
			assert.Equal(t, tt.want, got)
			assert.NoError(t, sqlMock.ExpectationsWereMet())
		})
	}
}
