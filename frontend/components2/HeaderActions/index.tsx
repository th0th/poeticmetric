"use client";

import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Auth from "~components/Auth";
import getIsHosted from "~helpers/getIsHosted";

export type HeaderActionsProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function HeaderActions({ className, ...props }: HeaderActionsProps) {
  const pathname = usePathname();

  return (
    <div {...props} className={classNames("align-items-center d-flex flex-row gap-3", className)}>
      <Auth
        ifAuthenticated={(
          <Link className="btn btn-primary btn-sm" href="/sites">Go to app</Link>
        )}
        ifUnauthenticated={(
          <>
            {pathname !== "/sign-in" ? (
              <Link className="btn btn-outline-primary btn-sm" href="/sign-in">Sign in</Link>
            ) : null}

            {getIsHosted() && pathname !== "/sign-up" ? (
              <Link className="btn btn-primary btn-sm" href="/sign-up">Sign up</Link>
            ) : null}
          </>
        )}
      />
    </div>
  );
}
