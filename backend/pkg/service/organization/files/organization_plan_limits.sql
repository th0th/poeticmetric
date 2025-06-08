SELECT
  plans.max_site_count,
  plans.max_user_count
FROM organizations
INNER JOIN plans ON organizations.plan_id = plans.id
WHERE
  organizations.id = @organizationID;
