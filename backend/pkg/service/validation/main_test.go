package validation

import (
	"context"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	v "github.com/RussellLuo/validating/v3"
	"github.com/stretchr/testify/assert"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
)

func Test_service_ResetUserPasswordParams(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	// language=postgresql
	selectQuery := `SELECT "password_reset_token" FROM "users" WHERE "users"."password_reset_token" = $1 ORDER BY "users"."id" LIMIT $2`

	type fields struct {
		postgres *gorm.DB
	}
	type args struct {
		ctx    context.Context
		params *poeticmetric.ResetUserPasswordParams
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func()
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.ResetUserPasswordParams{
					PasswordResetToken: poeticmetric.Pointer("token"),
					UserPassword:       poeticmetric.Pointer("password"),
					UserPassword2:      poeticmetric.Pointer("password"),
				},
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("token", 1).
					WillReturnRows(sqlmock.NewRows([]string{"password_reset_token"}).AddRow("token"))
			},
			wantErr: assert.NoError,
		},
		{
			name: "unsuccessful",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.ResetUserPasswordParams{
					PasswordResetToken: poeticmetric.Pointer("token"),
					UserPassword:       poeticmetric.Pointer("pass"),
					UserPassword2:      poeticmetric.Pointer("pass2"),
				},
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("token", 1).
					WillReturnRows(sqlmock.NewRows([]string{"password_reset_token"}))
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				var validationErrors v.Errors
				assert.ErrorAs(t, err, &validationErrors)

				errMap := validationErrors.Map()
				assert.NotNil(t, errMap["passwordResetToken"])
				assert.NotNil(t, errMap["userPassword"])
				assert.NotNil(t, errMap["userPassword2"])

				return true
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				postgres: tt.fields.postgres,
			}

			tt.setup()

			err = s.ResetUserPasswordParams(tt.args.ctx, tt.args.params)
			tt.wantErr(t, err)
		})
	}
}

func Test_service_SendUserPasswordRecoveryEmail(t *testing.T) {
	type fields struct {
		postgres *gorm.DB
	}
	type args struct {
		ctx    context.Context
		params *poeticmetric.SendUserPasswordRecoveryEmailParams
	}
	tests := []struct {
		name    string
		args    args
		fields  fields
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.SendUserPasswordRecoveryEmailParams{
					Email: poeticmetric.Pointer("user@domain.tld"),
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "invalid e-mail",
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.SendUserPasswordRecoveryEmailParams{
					Email: poeticmetric.Pointer("invalid-email"),
				},
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				return assert.Equal(
					t,
					v.NewErrors("email", v.ErrInvalid, "Please provide a valid e-mail address."),
					err,
				)
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				postgres: tt.fields.postgres,
			}

			gotErr := s.SendUserPasswordRecoveryEmailParams(tt.args.ctx, tt.args.params)
			tt.wantErr(t, gotErr)
		})
	}
}

func Test_service_uniqueSiteDomain(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	// language=postgresql
	selectQuery := `SELECT * FROM "sites" WHERE "sites"."domain" = $1 ORDER BY "sites"."id" LIMIT $2`

	// language=postgresql
	selectWithIdQuery := `SELECT * FROM "sites" WHERE "sites"."id" <> $1 AND "sites"."domain" = $2 ORDER BY "sites"."id" LIMIT $3`

	type fields struct {
		postgres *gorm.DB
	}
	type args struct {
		ctx    context.Context
		domain string
		siteID *uint
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func()
		want    bool
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "valid - nil siteID",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				domain: "www.domain.tld",
				siteID: nil,
			},
			setup: func() {
				sqlMock.ExpectQuery(selectQuery).WithArgs("www.domain.tld", 1).WillReturnRows(sqlmock.NewRows([]string{}))
			},
			want:    true,
			wantErr: assert.NoError,
		},
		{
			name: "valid",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				domain: "www.domain.tld",
				siteID: poeticmetric.Pointer(uint(1)),
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectWithIdQuery).
					WithArgs(1, "www.domain.tld", 1).
					WillReturnRows(sqlmock.NewRows([]string{}))
			},
			want:    true,
			wantErr: assert.NoError,
		},
		{
			name: "invalid - nil siteID",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				domain: "www.domain.tld",
				siteID: nil,
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("www.domain.tld", 1).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
			},
			want:    false,
			wantErr: assert.NoError,
		},
		{
			name: "invalid",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				domain: "www.domain.tld",
				siteID: poeticmetric.Pointer(uint(1)),
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectWithIdQuery).
					WithArgs(1, "www.domain.tld", 1).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
			},
			want:    false,
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				postgres: tt.fields.postgres,
			}

			tt.setup()

			got, gotErr := s.uniqueSiteDomain(tt.args.ctx, tt.args.domain, tt.args.siteID)
			tt.wantErr(t, gotErr)
			assert.Equal(t, tt.want, got)
		})
	}
}
