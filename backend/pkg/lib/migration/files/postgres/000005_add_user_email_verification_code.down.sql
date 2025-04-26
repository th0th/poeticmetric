ALTER TABLE users
  RENAME COLUMN email_verification_code TO email_verification_token;

ALTER TABLE users
  ADD CONSTRAINT users_email_verification_token_key UNIQUE (email_verification_token);
