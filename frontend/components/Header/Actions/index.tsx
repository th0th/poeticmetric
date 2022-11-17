import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { AuthAndApiContext } from "../../../contexts";
import { UserMenu } from "../../UserMenu";

export type ActionsProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function Actions({ className, ...props }: ActionsProps) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);

  const contentNode = useMemo(() => {
    if (user === null) {
      return (
        <>
          {router.pathname !== "/sign-in" ? (
            <Link className="btn btn-outline-primary" href="/sign-in">
              Sign in
            </Link>
          ) : null}

          {!["/sign-in", "/sign-up"].includes(router.pathname) ? (
            <div className="px-1" />
          ) : null}

          {router.pathname !== "/sign-up" ? (
            <Link className="btn btn-primary" href="/sign-up">
              Sign up
            </Link>
          ) : null}
        </>
      );
    }

    return (
      <UserMenu />
    );
  }, [router.pathname, user]);

  return (
    <div {...props} className={classNames("d-flex flex-row", className)}>
      {contentNode}
    </div>
  );
}
