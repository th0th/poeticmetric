import { JSX, PropsWithoutRef } from "react";
import { Link } from "wouter";
import Avatar from "~/components/Avatar";
import useAuthentication from "~/hooks/useAuthentication";
import useSearchParams from "~/hooks/useSearchParams";

export type UserProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  user: HydratedUser;
}>;

export default function User({ user, ...props }: UserProps) {
  const { setSearchParams } = useSearchParams();
  const { user: authUser } = useAuthentication();

  return (
    <div {...props} className="card">
      <div className="card-body overflow-hidden">
        <div className="d-flex gap-6">
          <Avatar alt={user.name} className="flex-grow-0 flex-shrink-0" email={user.email} size={96} />

          <div className="flex-grow-1 flex-shrink-1 overflow-hidden">
            <div className="fs-7 fw-bold text-body-tertiary text-truncate">{user.isOrganizationOwner ? "Owner" : "Team member"}</div>
            <div className="fs-5 fw-bold text-truncate" title={user.name}>{user.name}</div>
            <div className="fs-7 fw-semi-bold text-body-tertiary text-truncate" title={user.email}>{user.email}</div>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="d-flex flex-column flex-sm-row gap-4">
          <Link className="btn btn-primary btn-sm" to={`/team/edit?userID=${user.id}`}>Edit</Link>

          <Link className="btn btn-danger btn-sm" to={`/team${setSearchParams({ action: "delete", userID: user.id.toString() })}`}>
            Delete
          </Link>

          {authUser?.isOrganizationOwner && !user.isOrganizationOwner && user.isEmailVerified ? (
            <>
              <div className="d-none d-sm-block mx-auto" />

              <Link
                className="btn btn-outline-secondary btn-sm"
                to={`/team${setSearchParams({ action: "transferOwnership", userID: user.id.toString() })}`}
              >
                Transfer ownership
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
