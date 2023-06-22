"use client";

import classNames from "classnames";
import Link from "next/link";
import React from "react";
import Avatar from "~components/Avatar";
import useAuthUser from "~hooks/useAuthUser";

export type UserMenuProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export function UserMenu({ className, ...props }: UserMenuProps) {
  const { data: user } = useAuthUser();

  return user !== undefined ? (
    <div {...props} className={classNames("dropdown", className)}>
      <button
        className="bg-transparent bg-body-secondary-hover d-flex flex-row align-items-center px-2 py-1 border-0 rounded-1"
        data-bs-toggle="dropdown"
        type="button"
      >
        <Avatar alt={user.name} email={user.email} size={30} />
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <Link className="dropdown-item" href="/settings">Settings</Link>

        <li>
          <hr className="dropdown-divider" />
        </li>

        <Link className="dropdown-item" href="/sign-out">Sign out</Link>
      </ul>
    </div>
  ) : null;
}

export default UserMenu;
