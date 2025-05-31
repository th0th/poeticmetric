SELECT
  plans.max_user_count = -1 OR count(users.*) < plans.max_user_count
FROM users
INNER JOIN organizations ON users.organization_id = organizations.id
INNER JOIN plans ON organizations.plan_id = plans.id
WHERE
  users.organization_id = @organizationID
GROUP BY plans.id;
