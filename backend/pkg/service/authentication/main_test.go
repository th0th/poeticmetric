package authentication

import (
	"context"
	"log"
	"os"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/brianvoe/gofakeit/v7"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"golang.org/x/crypto/bcrypt"
	postgres2 "gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"github.com/th0th/poeticmetric/backend/pkg/poeticmetric"
	"github.com/th0th/poeticmetric/backend/pkg/service/email"
	"github.com/th0th/poeticmetric/backend/pkg/test/sqlmockhelper"
)

func TestNew(t *testing.T) {
	emailService := new(email.MockService)
	postgres := new(gorm.DB)
	validationService := new(poeticmetric.ValidationServiceMock)

	type args struct {
		params NewParams
	}
	tests := []struct {
		name string
		args args
		want poeticmetric.AuthenticationService
	}{
		{
			name: "successful",
			args: args{
				params: NewParams{
					EmailService:      emailService,
					Postgres:          postgres,
					ValidationService: validationService,
				},
			},
			want: &service{
				emailService:      emailService,
				postgres:          postgres,
				validationService: validationService,
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

func Test_service_CreateUserAccessToken(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	// language=postgresql
	insertQuery := `INSERT INTO "user_access_tokens" ("created_at","last_used_at","token","user_id") VALUES ($1,$2,$3,$4) RETURNING "id"`

	// language=postgresql
	selectQuery := `SELECT * FROM "user_access_tokens" WHERE "user_access_tokens"."id" = $1 ORDER BY "user_access_tokens"."id" LIMIT $2`

	type fields struct {
		emailService poeticmetric.EmailService
		postgres     *gorm.DB
	}
	type args struct {
		ctx    context.Context
		userID uint
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func() *sqlmockhelper.ValueArg
		want    func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationUserAccessToken, token *sqlmockhelper.ValueArg)
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				userID: 1,
			},
			setup: func() *sqlmockhelper.ValueArg {
				mockTokenValue := new(sqlmockhelper.ValueArg)
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, mockTokenValue, userAccessTokenID).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(userAccessTokenID))
				sqlMock.ExpectQuery(selectQuery).
					WithArgs(userAccessTokenID, 1).
					WillReturnRows(sqlmock.NewRows([]string{"created_at", "id", "token"}).AddRow(gofakeit.Date(), 1, "x"))
				sqlMock.ExpectCommit()

				return mockTokenValue
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationUserAccessToken, mockTokenValue *sqlmockhelper.ValueArg) {
				assert.NotNil(t, userAccessToken)
				assert.NotZero(t, userAccessToken.CreatedAt)
				assert.Equal(t, "x", userAccessToken.Token)
			},
			wantErr: assert.NoError,
		},
		{
			name: "any error on insert",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				userID: 1,
			},
			setup: func() *sqlmockhelper.ValueArg {
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, sqlmock.AnyArg(), userAccessTokenID).
					WillReturnError(os.ErrClosed)
				sqlMock.ExpectRollback()

				return nil
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationUserAccessToken, token *sqlmockhelper.ValueArg) {
				assert.Nil(t, userAccessToken)
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				return assert.ErrorIs(t, err, os.ErrClosed)
			},
		},
		{
			name: "any error on select",
			fields: fields{
				postgres: postgres,
			},
			args: args{
				ctx:    context.Background(),
				userID: 1,
			},
			setup: func() *sqlmockhelper.ValueArg {
				mockTokenValue := new(sqlmockhelper.ValueArg)
				userAccessTokenID := uint(1)

				sqlMock.ExpectBegin()
				sqlMock.ExpectQuery(insertQuery).
					WithArgs(sqlmock.AnyArg(), nil, mockTokenValue, userAccessTokenID).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(userAccessTokenID))
				sqlMock.ExpectQuery(selectQuery).
					WithArgs(userAccessTokenID, 1).
					WillReturnError(os.ErrClosed)
				sqlMock.ExpectRollback()

				return mockTokenValue
			},
			want: func(t assert.TestingT, userAccessToken *poeticmetric.AuthenticationUserAccessToken, token *sqlmockhelper.ValueArg) {
				assert.Nil(t, userAccessToken)
			},
			wantErr: func(t assert.TestingT, err error, i ...interface{}) bool {
				return assert.ErrorIs(t, err, os.ErrClosed)
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				emailService: tt.fields.emailService,
				postgres:     tt.fields.postgres,
			}

			mockTokenValue := tt.setup()

			got, gotErr := s.CreateUserAccessToken(tt.args.ctx, tt.args.userID)
			tt.wantErr(t, gotErr)
			tt.want(t, got, mockTokenValue)
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

			assert.NoError(t, sqlMock.ExpectationsWereMet())
		})
	}
}

func Test_service_DeleteUserAccessTokens(t *testing.T) {
	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, err)

	// language=postgresql
	deleteQuery := `DELETE FROM "user_access_tokens" WHERE "user_access_tokens"."user_id" = $1`

	type fields struct {
		emailService poeticmetric.EmailService
		postgres     *gorm.DB
	}
	type args struct {
		ctx    context.Context
		userID uint
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
				ctx:    context.Background(),
				userID: 1,
			},
			setup: func() {
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(deleteQuery).WithArgs(1).WillReturnResult(sqlmock.NewResult(0, 1))
				sqlMock.ExpectCommit()
			},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				emailService: tt.fields.emailService,
				postgres:     tt.fields.postgres,
			}

			tt.setup()

			err = s.DeleteUserAccessTokens(tt.args.ctx, tt.args.userID)
			tt.wantErr(t, err)
		})
	}
}

func Test_service_ResetUserPassword(t *testing.T) {
	db, sqlMock, gotErr := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, gotErr)

	postgres, gotErr := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{})
	assert.NoError(t, gotErr)

	mockValidationService := new(poeticmetric.ValidationServiceMock)

	// language=postgresql
	selectQuery := `SELECT "id" FROM "users" WHERE "users"."password_reset_token" = $1 ORDER BY "users"."id" LIMIT $2`

	// language=postgresql
	updateQuery := `UPDATE "users" SET "password"=$1,"password_reset_token"=$2 WHERE "id" = $3`

	type fields struct {
		emailService      poeticmetric.EmailService
		postgres          *gorm.DB
		validationService poeticmetric.ValidationService
	}
	type args struct {
		ctx    context.Context
		params *poeticmetric.ResetUserPasswordParams
	}
	type payload struct {
		password *sqlmockhelper.ValueArg
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		setup   func() payload
		want    func(payload)
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "successful",
			fields: fields{
				postgres:          postgres,
				validationService: mockValidationService,
			},
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.ResetUserPasswordParams{
					PasswordResetToken: poeticmetric.Pointer("token"),
					UserPassword:       poeticmetric.Pointer("password"),
					UserPassword2:      poeticmetric.Pointer("password"),
				},
			},
			setup: func() payload {
				passwordArg := new(sqlmockhelper.ValueArg)

				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("token", 1).
					WillReturnRows(sqlmock.NewRows([]string{"id"}).AddRow(1))
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(updateQuery).WithArgs(passwordArg, sqlmock.AnyArg(), 1).WillReturnResult(sqlmock.NewResult(0, 1))
				sqlMock.ExpectCommit()

				mockValidationService.On("ResetUserPasswordParams", mock.Anything, &poeticmetric.ResetUserPasswordParams{
					PasswordResetToken: poeticmetric.Pointer("token"),
					UserPassword:       poeticmetric.Pointer("password"),
					UserPassword2:      poeticmetric.Pointer("password"),
				}).Return(nil)

				return payload{
					password: passwordArg,
				}
			},
			want: func(payload payload) {
				assert.NoError(t, bcrypt.CompareHashAndPassword([]byte(payload.password.Value.(string)), []byte("password")))
			},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				emailService:      tt.fields.emailService,
				postgres:          tt.fields.postgres,
				validationService: tt.fields.validationService,
			}

			p := tt.setup()

			gotErr = s.ResetUserPassword(tt.args.ctx, tt.args.params)
			tt.wantErr(t, gotErr)
			tt.want(p)

			assert.NoError(t, sqlMock.ExpectationsWereMet())
			mockValidationService.AssertExpectations(t)
		})
	}
}

func Test_service_SendUserPasswordRecoveryEmail(t *testing.T) {
	mockEmailService := new(email.MockService)
	mockValidationService := new(poeticmetric.ValidationServiceMock)

	db, sqlMock, err := sqlmock.New(sqlmock.QueryMatcherOption(sqlmock.QueryMatcherEqual))
	assert.NoError(t, err)

	postgres, err := gorm.Open(postgres2.New(postgres2.Config{Conn: db}), &gorm.Config{
		Logger: logger.New(log.New(os.Stdout, "\r\n", log.LstdFlags), logger.Config{LogLevel: logger.Info}),
	})
	assert.NoError(t, err)

	// language=postgresql
	selectQuery := `SELECT * FROM "users" WHERE "users"."email" = $1 ORDER BY "users"."id" LIMIT $2`

	// language=postgresql
	updateQuery := `UPDATE "users" SET "password_reset_token"=$1 WHERE "id" = $2`

	type fields struct {
		emailService      poeticmetric.EmailService
		postgres          *gorm.DB
		validationService poeticmetric.ValidationService
	}
	type args struct {
		ctx    context.Context
		params *poeticmetric.SendUserPasswordRecoveryEmailParams
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
				emailService:      mockEmailService,
				postgres:          postgres,
				validationService: mockValidationService,
			},
			args: args{
				ctx: context.Background(),
				params: &poeticmetric.SendUserPasswordRecoveryEmailParams{
					Email: poeticmetric.Pointer("user@domain.tld"),
				},
			},
			setup: func() {
				sqlMock.
					ExpectQuery(selectQuery).
					WithArgs("user@domain.tld", 1).
					WillReturnRows(sqlmock.NewRows([]string{"email", "id", "name"}).AddRow("user@domain.tld", uint(1), "User"))
				sqlMock.ExpectBegin()
				sqlMock.ExpectExec(updateQuery).WithArgs(sqlmock.AnyArg(), 1).WillReturnResult(sqlmock.NewResult(0, 1))
				sqlMock.ExpectCommit()

				mockEmailService.On("Send", mock.MatchedBy(func(params poeticmetric.SendEmailParams) bool {
					templateData := params.TemplateData.(poeticmetric.PasswordRecoveryEmailTemplateParams)

					return params.Template == poeticmetric.PasswordRecoveryEmailTemplate &&
						params.To.Address == "user@domain.tld" &&
						params.To.Name == "User" &&
						templateData.User.Email == "user@domain.tld" &&
						templateData.User.ID == 1 &&
						templateData.User.Name == "User"
				})).Return(nil)

				mockValidationService.On(
					"SendUserPasswordRecoveryEmailParams",
					mock.Anything,
					&poeticmetric.SendUserPasswordRecoveryEmailParams{
						Email: poeticmetric.Pointer("user@domain.tld"),
					},
				).Return(nil)
			},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &service{
				emailService:      tt.fields.emailService,
				postgres:          tt.fields.postgres,
				validationService: tt.fields.validationService,
			}

			tt.setup()

			gotErr := s.SendUserPasswordRecoveryEmail(tt.args.ctx, tt.args.params)
			tt.wantErr(t, gotErr)

			mockValidationService.AssertExpectations(t)
		})
	}
}
