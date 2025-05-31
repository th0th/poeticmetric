ALTER TABLE plans
  RENAME max_user_count TO max_users;

ALTER TABLE plans
  ADD COLUMN stripe_product_id text,
  DROP COLUMN data_retention_days,
  DROP COLUMN max_site_count;
