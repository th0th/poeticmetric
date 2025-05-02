DELETE
FROM organizations
  USING users
WHERE
  organizations.id = users.organization_id
  AND organizations.created_at <= now() - (@unverifiedOrganizationDeletionDays * INTERVAL '1 day')
  AND users.is_organization_owner IS TRUE
  AND users.is_email_verified = FALSE
RETURNING
  organizations.created_at AS organization_created_at,
  organizations.id AS organization_id,
  organizations.name AS organization_name,
  organizations.updated_at AS organization_updated_at,
  users.created_at AS user_created_at,
  users.email AS user_email,
  users.id AS user_id,
  users.last_access_token_created_at AS user_last_access_token_created_at,
  users.name AS user_name,
  users.updated_at AS user_updated_at;
