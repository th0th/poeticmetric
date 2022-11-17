import classNames from "classnames";
import Link from "next/link";
import React from "react";
import { Card, CardProps } from "react-bootstrap";
import { Avatar } from "../../../components";

export type UserProps = Overwrite<Omit<CardProps, "children">, {
  user: User,
}>;

export function User({ user, ...props }: UserProps) {
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

          <div className="mx-1" />

          <Avatar alt={user.name} className="ms-auto" email={user.email} />
        </div>
      </Card.Body>

      <Card.Footer>
        <div className="d-flex flex-column flex-sm-row">
          <Link className="btn btn-sm btn-primary" href={`/team/edit?id=${user.id}`}>Edit</Link>

          <Link className={classNames("mt-2 mt-sm-0 ms-sm-2 btn btn-sm btn-danger", user.isOrganizationOwner && "disabled",)} href="/">
            Delete
          </Link>
        </div>
      </Card.Footer>
    </Card>
  );
}
