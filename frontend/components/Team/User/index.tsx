import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Card, CardProps, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Avatar } from "../..";

export type UserProps = Overwrite<Omit<CardProps, "children">, {
  user: User;
}>;

export function User({ user, ...props }: UserProps) {
  const router = useRouter();

  const deleteLinkNode = useMemo<React.ReactNode>(() => {
    if (user.isOrganizationOwner) {
      return null;
    }

    return (
      <Link
        className="mt-2 mt-sm-0 ms-sm-2 btn btn-sm btn-danger"
        href={{ pathname: router.pathname, query: { ...router.query, deleteUserId: user.id } }}
      >
        Delete
      </Link>
    );
  }, [router.pathname, router.query, user.id, user.isOrganizationOwner]);

  const pendingNode = useMemo<React.ReactNode>(() => (!user.isActive ? (
    <OverlayTrigger
      overlay={(
        <Tooltip className="fw-medium fs-xs">
          Waiting for team member to accept the invite.
        </Tooltip>
      )}
    >
      <div className="align-items-center bg-warning bottom-0 d-flex flex-column h-1_5rem justify-content-center position-absolute rounded-circle start-0 w-1_5rem text-white">
        <i className="bi bi-hourglass-split d-block fs-sm" />
      </div>
    </OverlayTrigger>
  ) : null), [user.isActive]);

  return (
    <Card {...props}>
      <Card.Body>
        <div className="d-flex flex-row">
          <div className="overflow-hidden">
            <Card.Title className="text-truncate" title={user.name}>{user.name}</Card.Title>

            <Card.Subtitle className="text-muted text-truncate" title={user.email}>
              <small>{user.email}</small>
            </Card.Subtitle>
          </div>

          <div className="flex-grow-1 px-1" />

          <div className="position-relative">
            <Avatar alt={user.name} email={user.email} size={48} />

            {pendingNode}
          </div>
        </div>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex flex-column flex-sm-row">
          <Link className="btn btn-sm btn-primary" href={`/team/edit?id=${user.id}`}>Edit</Link>

          {deleteLinkNode}
        </div>
      </Card.Footer>
    </Card>
  );
}
