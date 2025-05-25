ALTER TABLE sites
  ADD COLUMN google_oauth_refresh_token text;

UPDATE sites
SET
  google_oauth_refresh_token = (
    SELECT
      google_oauth_refresh_token
    FROM organizations
    WHERE
      organizations.id = sites.organization_id
  );

ALTER TABLE organizations
  DROP COLUMN google_oauth_refresh_token;
