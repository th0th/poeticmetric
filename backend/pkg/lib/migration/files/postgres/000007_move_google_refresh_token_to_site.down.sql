ALTER TABLE organizations
  ADD COLUMN google_oauth_refresh_token text;

-- we are moving the data from the sites table to the organizations table, but we lost the original data
UPDATE organizations
SET
  google_oauth_refresh_token = (
    SELECT
      google_oauth_refresh_token
    FROM sites
    WHERE
      sites.google_oauth_refresh_token IS NOT NULL
      AND sites.id = organizations.site_id
  );

ALTER TABLE sites
  DROP COLUMN google_oauth_refresh_token;
