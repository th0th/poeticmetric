import Link from "next/link";
import React, { useContext } from "react";
import { Dropdown, DropdownProps } from "react-bootstrap";
import { AuthAndApiContext } from "../../contexts";
import { Avatar } from "../Avatar";

export type UserMenuProps = Omit<DropdownProps, "children">;

export function UserMenu({ ...props }: UserMenuProps) {
  const { user } = useContext(AuthAndApiContext);

  return user !== null ? (
    <Dropdown {...props}>
      <Dropdown.Toggle as="button" className="bg-transparent bg-light-hover d-flex flex-row align-items-center px-2 py-1 border-0 rounded-1">
        <Avatar alt={user.name} email={user.email} size={30} />
      </Dropdown.Toggle>

      <Dropdown.Menu align="end">
        <Link className="dropdown-item" href="/settings">Settings</Link>

        <Dropdown.Divider />

        <Link className="dropdown-item" href="/sign-out">Sign out</Link>
      </Dropdown.Menu>
    </Dropdown>
  ) : null;
}
