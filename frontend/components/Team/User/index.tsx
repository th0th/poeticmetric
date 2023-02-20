import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Card, CardProps, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Avatar } from "../..";
import { AuthContext } from "../../../contexts";

export type UserProps = Overwrite<Omit<CardProps, "children">, {
  user: User;
}>;

export function User({ user, ...props }: UserProps) {
  const router = useRouter();
  const { user: authUser } = useContext(AuthContext);

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

            {user.isOrganizationOwner ? (
              <OverlayTrigger
                overlay={(
                  <Tooltip className="fs-xs fw-medium">
                    This account is the organization owner.
                  </Tooltip>
                )}
                placement="bottom"
              >
                <div
                  className="align-items-center bg-secondary d-flex flex-column h-1_5rem justify-content-center mt-n3 position-absolute rounded-circle start-0 w-1_5rem text-white top-100"
                  tabIndex={0}
                >
                  <i className="bi bi-lightning-fill d-block fs-sm" />
                </div>
              </OverlayTrigger>
            ) : null}

            {!user.isActive ? (
              <OverlayTrigger
                overlay={(
                  <Tooltip className="fs-xs fw-medium">
                    Waiting for team member to accept the invite.
                  </Tooltip>
                )}
                placement="bottom"
              >
                <div
                  className="align-items-center bg-warning d-flex flex-column h-1_5rem justify-content-center mt-n3 position-absolute rounded-circle start-0 w-1_5rem text-white top-100"
                  tabIndex={0}
                >
                  <i className="bi bi-hourglass-split d-block fs-sm" />
                </div>
              </OverlayTrigger>
            ) : null}
          </div>
        </div>
      </Card.Body>

      {authUser?.isOrganizationOwner ? (
        <Card.Footer>
          <Row className="g-2" sm="auto">
            <div className="d-grid">
              <Link className="btn btn-sm btn-primary" href={`/team/edit?id=${user.id}`}>Edit</Link>
            </div>

            {!user.isOrganizationOwner ? (
              <div className="d-grid">
                <Link
                  className="btn btn-sm btn-danger"
                  href={{ pathname: router.pathname, query: { ...router.query, deleteUserId: user.id } }}
                >
                  Delete
                </Link>
              </div>
            ) : null}

            {!user.isOrganizationOwner ? (
              <>
                <div className="d-none d-sm-block flex-grow-1" />

                <OverlayTrigger
                  overlay={!user.isActive ? (
                    <Tooltip className="fs-xs fw-medium">
                      Team member should activate their account to get the owner role.
                    </Tooltip>
                  ) : (<></>)}
                  placement="bottom"
                >
                  <div className="d-grid">
                    <Link
                      className={classNames("btn btn-secondary btn-sm", !user.isActive && "disabled")}
                      href={{ pathname: router.pathname, query: { ...router.query, newOrganizationOwnerId: user.id } }}
                      tabIndex={user.isActive ? 0 : -1}
                    >
                      Make owner
                    </Link>
                  </div>
                </OverlayTrigger>
              </>
            ) : null}
          </Row>
        </Card.Footer>
      ) : null}
    </Card>
  );
}
