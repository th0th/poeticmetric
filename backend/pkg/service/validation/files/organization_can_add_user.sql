SELECT
  plans.max_users = -1 or count(users.*) < plans.max_users
FROM users
INNER JOIN organizations ON users.organization_id = organizations.id
INNER JOIN plans ON organizations.plan_id = plans.id
WHERE
  users.organization_id = @organizationID
GROUP BY plans.id;
