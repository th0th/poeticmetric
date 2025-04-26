ALTER TABLE users
  RENAME COLUMN email_verification_token TO email_verification_code;

ALTER TABLE users
  DROP CONSTRAINT users_email_verification_token_key;
