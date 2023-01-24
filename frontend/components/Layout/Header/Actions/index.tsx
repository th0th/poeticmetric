import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { AuthAndApiContext, LayoutContext } from "../../../../contexts";
import { UserMenu } from "../../../UserMenu";

export type ActionsProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export function Actions({ className, ...props }: ActionsProps) {
  const router = useRouter();
  const { user } = useContext(AuthAndApiContext);
  const { kind } = useContext(LayoutContext);

  const contentNode = useMemo(() => {
    if (user === null) {
      return (
        <>
          {router.pathname !== "/sign-in" ? (
            <Link className="btn btn-outline-primary" href="/sign-in">
              Sign in
            </Link>
          ) : null}

          {process.env.NEXT_PUBLIC_HOSTED === "true" && router.pathname !== "/sign-up" ? (
            <Link className="btn btn-primary" href="/sign-up">
              Sign up
            </Link>
          ) : null}
        </>
      );
    }

    return (
      <>
        {kind === "website" ? (
          <Link className="btn btn-primary" href="/sites">
            Go to app
          </Link>
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
