import { IconUserPlus } from "@tabler/icons-react";
import { Link } from "wouter";
import Breadcrumb from "~/components/Breadcrumb";
import User from "~/components/Team/User";
import Title from "~/components/Title";
import withAuthorization from "~/components/withAuthorization";
import useUsers from "~/hooks/api/useUsers";
import useListFilters from "~/hooks/useListFilters";

function Team() {
  const { data: users } = useUsers();
  const [listFilters, filteredUsers] = useListFilters(users, [
    {
      dataBy: (user) => user.isOrganizationOwner ? "owner" : "teamMember",
      dataDisplayBy: (user) => user.isOrganizationOwner ? "Owner" : "Team member",
      name: "Role",
      searchParamName: "role",
    },
  ]);

  return (
    <>
      <Title>Team</Title>

      <div className="container py-16">
        <Breadcrumb>
          <Breadcrumb.Title>Team</Breadcrumb.Title>
        </Breadcrumb>

        <div className="d-flex flex-column flex-md-row gap-4 mt-12">
          {listFilters}

          <div className="d-none d-md-block mx-auto" />

          <Link className="align-items-center btn btn-primary d-flex gap-2 justify-content-center overflow-hidden" to="/teams/invite">
            <IconUserPlus className="flex-grow-0 flex-shrink-0" />

            <span className="text-truncate">Invite team member</span>
          </Link>
        </div>

        <div className="gy-12 mt-8 row row-cols-1 row-cols-md-2 row-cols-xl-3">
          {filteredUsers?.map((user) => (
            <div className="col" key={user.id}>
              <User user={user} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default withAuthorization(Team, { isAuthenticated: true });
