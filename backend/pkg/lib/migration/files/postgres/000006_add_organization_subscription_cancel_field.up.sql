ALTER TABLE organizations
  ADD COLUMN subscription_cancel_at_period_end boolean;

UPDATE organizations
SET
  subscription_cancel_at_period_end = FALSE
WHERE
  stripe_customer_id IS NOT NULL
