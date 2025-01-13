package authentication

import (
	"context"
	"reflect"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/brianvoe/gofakeit/v7"
	gormpostgres "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/test/modelhelper"
	"github.com/th0th/poeticmetric/backend/pkg/test/testcontainer"
)

func Test_service_GetOrganization(t *testing.T) {
	ctx := context.Background()

	t.Run("unit", func(t *testing.T) {
		db, postgresMock, err := sqlmock.New(
			sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual),
		)
		if err != nil {
			t.Fatal(err)
		}

		postgres, err := gorm.Open(gormpostgres.New(gormpostgres.Config{Conn: db}), &gorm.Config{})
		if err != nil {
			t.Fatal(err)
		}

		// language=postgresql
		selectQuery := `SELECT * FROM "organizations" WHERE "organizations"."id" = $1 ORDER BY "organizations"."name" LIMIT $2`

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
			want    *poeticmetric.AuthenticationOrganization
			wantErr error
		}{
			{
				name: "success",
				fields: fields{
					postgres: postgres,
				},
				args: args{
					ctx:            ctx,
					organizationID: 1,
				},
				setup: func() {
					postgresMock.
						ExpectQuery(selectQuery).
						WithArgs(1, 1).
						WillReturnRows(sqlmock.NewRows([]string{"name", "time_zone"}).AddRow("PoeticMetric", "UTC"))
				},
				want: &poeticmetric.AuthenticationOrganization{
					Name: "PoeticMetric",
				},
				wantErr: nil,
			},
		}
		for _, tt := range tests {
			t.Run(tt.name, func(t *testing.T) {
				s := &service{
					postgres: tt.fields.postgres,
				}

				if tt.setup != nil {
					tt.setup()
				}

				got, err := s.ReadOrganization(tt.args.ctx, tt.args.organizationID)
				if tt.wantErr == nil {
					if err != nil {
						t.Errorf("service.ReadOrganization() error = %v, wantErr %v", err, tt.wantErr)
						return
					}
				}

				if !reflect.DeepEqual(tt.want, got) {
					t.Errorf("service.ReadOrganization() = %v, want %v", got, tt.want)
				}

				err = postgresMock.ExpectationsWereMet()
				if err != nil {
					t.Errorf("expectations were not met: %v", err)
				}
			})
		}
	})

	t.Run("integration", func(t *testing.T) {
		postgresCtr, postgres := testcontainer.NewPostgres(t, ctx)
		t.Cleanup(func() {
			err := postgresCtr.Terminate(ctx)
			if err != nil {
				t.Fatal(err)
			}
		})

		s := service{
			postgres: postgres,
		}

		organization := poeticmetric.Organization{
			Name:     gofakeit.Company(),
		}
		modelhelper.Organization(t, postgres, &organization)

		authenticationOrganization, err := s.ReadOrganization(ctx, 1)
		if err != nil {
			t.Errorf("service.ReadOrganization() error = %v", err)
			return
		}

		expectedAuthenticationOrganization := poeticmetric.AuthenticationOrganization{
			Name:     organization.Name,
		}

		if !reflect.DeepEqual(expectedAuthenticationOrganization, *authenticationOrganization) {
			t.Errorf("service.ReadOrganization() = %v, want %v", *authenticationOrganization, expectedAuthenticationOrganization)
		}
	})
}
