import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { AuthContext, LayoutContext } from "../../../../contexts";
import { getIsHosted } from "../../../../helpers";
import { UserMenu } from "../../../UserMenu";

export type ActionsProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function Actions({ className, ...props }: ActionsProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { kind } = useContext(LayoutContext);

  const contentNode = useMemo(() => {
    if (user === null) {
      return (
        <>
          {router.pathname !== "/sign-in" ? (
            <Link className="btn btn-outline-primary btn-sm" href="/sign-in">Sign in</Link>
          ) : null}

          {getIsHosted() && router.pathname !== "/sign-up" ? (
            <Link className="btn btn-primary btn-sm" href="/sign-up">Sign up</Link>
          ) : null}
        </>
      );
    }

    return (
      <>
        {kind === "website" ? (
          <Link className="btn btn-primary btn-sm" href="/sites">Go to app</Link>
        ) : null}

        <UserMenu />
      </>
    );
  }, [kind, router.pathname, user]);

  return (
    <div {...props} className={`align-items-center d-flex flex-row gap-3 ${className}`}>
      {contentNode}
    </div>
  );
}
