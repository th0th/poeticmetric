ALTER TABLE plans
  ADD COLUMN data_retention_days int,
  ADD COLUMN max_site_count int,
  DROP COLUMN stripe_product_id,
  DROP CONSTRAINT plans_name_key;

ALTER TABLE plans
  RENAME COLUMN max_users TO max_user_count;
