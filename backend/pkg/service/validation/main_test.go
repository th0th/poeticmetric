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

func Test_service_AuthenticationResetUserPasswordParams(t *testing.T) {
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
		params *poeticmetric.AuthenticationResetUserPasswordParams
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
				params: &poeticmetric.AuthenticationResetUserPasswordParams{
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
				params: &poeticmetric.AuthenticationResetUserPasswordParams{
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

			err = s.AuthenticationResetUserPasswordParams(tt.args.ctx, tt.args.params)
			tt.wantErr(t, err)
		})
	}
}

func Test_service_AuthenticationSendUserPasswordRecoveryEmail(t *testing.T) {
	type fields struct {
		postgres     *gorm.DB
	}
	type args struct {
		ctx    context.Context
		params *poeticmetric.AuthenticationSendUserPasswordRecoveryEmailParams
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
				params: &poeticmetric.AuthenticationSendUserPasswordRecoveryEmailParams{
					Email: poeticmetric.Pointer("user@domain.tld"),
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "invalid e-mail",
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.AuthenticationSendUserPasswordRecoveryEmailParams{
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

			gotErr := s.AuthenticationSendUserPasswordRecoveryEmailParams(tt.args.ctx, tt.args.params)
			tt.wantErr(t, gotErr)
		})
	}
}
