package authentication

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	v "github.com/RussellLuo/validating/v3"
	"github.com/brianvoe/gofakeit/v7"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/service/email"
	"github.com/th0th/poeticmetric/backend/pkg/test/sqlmockhelper"
)

func Test_service_CreateUserAccessToken(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	authenticationService := service{
		postgres: postgres,
	}

	// language=postgresql
	insertQuery := `INSERT INTO "user_access_tokens" ("created_at","last_used_at","token","user_id") VALUES ($1,$2,$3,$4) RETURNING "id"`

	// language=postgresql
	selectQuery := `SELECT * FROM "user_access_tokens" WHERE "user_access_tokens"."id" = $1 ORDER BY "user_access_tokens"."id" LIMIT $2`

	tests := []struct {
		name      string
		setupMock func(token *sqlmockhelper.AnyValue)
		userID    uint
		want      func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationServiceUserAccessToken, token *sqlmockhelper.AnyValue)
		wantErr   assert.ErrorAssertionFunc
	}{
		{
			name:   "successful",
			userID: 1,
			setupMock: func(token *sqlmockhelper.AnyValue) {
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, token, userAccessTokenID).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(userAccessTokenID))
				sqlMock.ExpectQuery(selectQuery).
					WithArgs(userAccessTokenID, 1).
					WillReturnRows(sqlmock.NewRows([]string{"created_at", "id", "token"}).AddRow(gofakeit.Date(), 1, "x"))
				sqlMock.ExpectCommit()
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationServiceUserAccessToken, token *sqlmockhelper.AnyValue) {
				assert.NotNil(t, userAccessToken)
				assert.NotZero(t, userAccessToken.CreatedAt)
				assert.Equal(t, "x", userAccessToken.Token)
			},
			wantErr: assert.NoError,
		},
		{
			name:   "any error on insert",
			userID: 1,
			setupMock: func(token *sqlmockhelper.AnyValue) {
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, token, userAccessTokenID).
					WillReturnError(os.ErrClosed)
				sqlMock.ExpectRollback()
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationServiceUserAccessToken, token *sqlmockhelper.AnyValue) {
				assert.Nil(t, userAccessToken)
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				return assert.ErrorIs(t, err, os.ErrClosed)
			},
		},
		{
			name:   "any error on select",
			userID: 1,
			setupMock: func(token *sqlmockhelper.AnyValue) {
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, token, userAccessTokenID).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(userAccessTokenID))
				sqlMock.ExpectQuery(selectQuery).
					WithArgs(userAccessTokenID, 1).
					WillReturnError(os.ErrClosed)
				sqlMock.ExpectRollback()
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationServiceUserAccessToken, token *sqlmockhelper.AnyValue) {
				assert.Nil(t, userAccessToken)
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				return assert.ErrorIs(t, err, os.ErrClosed)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			token := sqlmockhelper.AnyValue{}
			tt.setupMock(&token)

			userAccessToken, err2 := authenticationService.CreateUserAccessToken(context.Background(), tt.userID)
			tt.wantErr(t, err2)

			tt.want(t, userAccessToken, &token)

			err = sqlMock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}

func Test_service_DeleteUserAccessToken(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	authenticationService := service{
		postgres: postgres,
	}

	// language=postgresql
	selectFirstQuery := `SELECT * FROM "user_access_tokens" WHERE "user_access_tokens"."id" = $1 ORDER BY "user_access_tokens"."id" LIMIT $2`

	// language=postgresql
	deleteQuery := `DELETE FROM "user_access_tokens" WHERE "user_access_tokens"."id" = $1`

	tests := []struct {
		name              string
		setupMock         func()
		userAccessTokenID uint
		wantErr           assert.ErrorAssertionFunc
	}{
		{
			name:              "successful",
			userAccessTokenID: 1,
			setupMock: func() {
				sqlMock.ExpectQuery(selectFirstQuery).WithArgs(1, 1).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteQuery).WithArgs(1).WillReturnResult(sqlmock.NewResult(0, 1))
				sqlMock.ExpectCommit()
			},
			wantErr: assert.NoError,
		},
		{
			name: "not found",
			setupMock: func() {
				sqlMock.ExpectQuery(selectFirstQuery).WithArgs(1, 1).WillReturnRows(sqlmock.NewRows([]string{"id"}))
			},
			userAccessTokenID: 1,
			wantErr: func(t assert.TestingT, err error, i ...any) bool {
				return assert.ErrorIs(t, err, poeticmetric.ErrNotFound)
			},
		},
		{
			name: "any error on delete",
			setupMock: func() {
				sqlMock.ExpectQuery(selectFirstQuery).WithArgs(1, 1).WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteQuery).WithArgs(1).WillReturnError(os.ErrClosed)
				sqlMock.ExpectRollback()
			},
			userAccessTokenID: 1,
			wantErr: func(t assert.TestingT, err error, i ...any) bool {
				return assert.ErrorIs(t, err, os.ErrClosed)
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setupMock()

			err = authenticationService.DeleteUserAccessToken(context.Background(), tt.userAccessTokenID)
			tt.wantErr(t, err)

			err = sqlMock.ExpectationsWereMet()
			assert.NoError(t, err)
		})
	}
}

func Test_service_SendUserPasswordRecoveryEmail(t *testing.T) {
	mockEmailService := new(email.MockService)

	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	authenticationService := service{
		emailService: mockEmailService,
		postgres:     postgres,
	}

	// language=postgresql
	selectQuery := `SELECT * FROM "users" WHERE "users"."email" = $1 ORDER BY "users"."id" LIMIT $2`

	tests := []struct {
		name    string
		params  *poeticmetric.AuthenticationServiceSendUserPasswordRecoveryEmailParams
		setup   func()
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			params: &poeticmetric.AuthenticationServiceSendUserPasswordRecoveryEmailParams{
				Email: poeticmetric.Pointer("user@domain.tld"),
			},
			setup: func() {
				mockEmailService.On("Send", mock.MatchedBy(func(params poeticmetric.EmailServiceSendParams) bool {
					templateData := params.TemplateData.(poeticmetric.EmailServiceTemplatePasswordRecoveryParams)

					return params.Template == poeticmetric.EmailServiceTemplatePasswordRecovery &&
						params.To.Address == "user@domain.tld" &&
						params.To.Name == "User" &&
						templateData.User.Email == "user@domain.tld" &&
						templateData.User.ID == 1 &&
						templateData.User.Name == "User"
				})).Return(nil)

				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("user@domain.tld", 1).
					WillReturnRows(sqlmock.NewRows([]string{"email", "id", "name"}).AddRow("user@domain.tld", uint(1), "User"))
			},
			wantErr: assert.NoError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.setup()

			err = authenticationService.SendUserPasswordRecoveryEmail(context.Background(), tt.params)
			tt.wantErr(t, err)

			err = sqlMock.ExpectationsWereMet()
			assert.NoError(t, err)

			mockEmailService.AssertExpectations(t)
		})
	}
}

func Test_service_validateSendUserPasswordRecoveryEmail(t *testing.T) {
	type args struct {
		ctx    context.Context
		params *poeticmetric.AuthenticationServiceSendUserPasswordRecoveryEmailParams
	}
	tests := []struct {
		name    string
		args    args
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.AuthenticationServiceSendUserPasswordRecoveryEmailParams{
					Email: poeticmetric.Pointer("user@domain.tld"),
				},
			},
			wantErr: assert.NoError,
		},
		{
			name: "invalid e-mail",
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.AuthenticationServiceSendUserPasswordRecoveryEmailParams{
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
			s := &service{}

			tt.wantErr(t, s.validateSendUserPasswordRecoveryEmail(tt.args.ctx, tt.args.params), fmt.Sprintf("validateSendUserPasswordRecoveryEmail(%v, %v)", tt.args.ctx, tt.args.params))
		})
	}
}
