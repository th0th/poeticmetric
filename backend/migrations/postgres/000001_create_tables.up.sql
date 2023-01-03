CREATE TABLE "plans" (
  "created_at" timestamptz NOT NULL,
  "id" bigserial,
  "max_events_per_month" bigint,
  "max_users" int,
  "name" text UNIQUE NOT NULL,
  "stripe_product_id" text,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "organizations" (
  "created_at" timestamptz NOT NULL,
  "id" bigserial,
  "is_on_trial" boolean NOT NULL,
  "name" text NOT NULL,
  "plan_id" bigint,
  "stripe_customer_id" text,
  "subscription_period" text,
  "trial_ends_at" timestamptz,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_organizations_plan_id" FOREIGN KEY ("plan_id") REFERENCES "plans" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_organizations_plan_id" ON "organizations" ("plan_id");

CREATE TABLE "organization_deletions" (
  "date_time" timestamptz NOT NULL,
  "details" text,
  "id" bigserial,
  "organization_created_at" timestamptz NOT NULL,
  "organization_id" bigint NOT NULL,
  "organization_name" text NOT NULL,
  "organization_plan_name" text NOT NULL,
  "organization_stripe_customer_id" text,
  "reason" text NOT NULL,
  "user_email" text NOT NULL,
  "user_id" bigint NOT NULL,
  "user_name" text NOT NULL,
  PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "created_at" timestamptz NOT NULL,
  "email" text UNIQUE NOT NULL,
  "email_verification_token" text UNIQUE,
  "id" bigserial,
  "is_email_verified" boolean NOT NULL,
  "is_organization_owner" boolean NOT NULL,
  "last_access_token_created_at" timestamptz,
  "name" text,
  "organization_id" bigint NOT NULL,
  "password" text NOT NULL,
  "password_reset_token" text UNIQUE,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_users_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_users_organization_id" ON "users" ("organization_id");

CREATE TABLE "user_access_tokens" (
  "created_at" timestamptz NOT NULL,
  "id" bigserial,
  "last_used_at" timestamptz,
  "token" text NOT NULL,
  "user_id" bigint,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_user_access_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_user_access_tokens_user_id" ON "user_access_tokens" ("user_id");

CREATE TABLE "sites" (
  "created_at" timestamptz NOT NULL,
  "domain" text UNIQUE,
  "id" bigserial,
  "name" text,
  "organization_id" bigint,
  "updated_at" timestamptz NOT NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "fk_sites_organization_id" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE CASCADE
);

CREATE INDEX "idx_sites_organization_id" ON "sites" ("organization_id");
