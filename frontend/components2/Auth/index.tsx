"use client";

import classNames from "classnames";
import { NavigateOptions } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthUser from "~hooks/useAuthUser";

export type AuthProps = {
  className?: string;
  ifAuthenticated?: React.ReactNode;
  ifUnauthenticated?: React.ReactNode;
  renderSpinner?: boolean;
  replaceIfAuthenticated?: string | {
    href: string;
    options?: NavigateOptions;
  };
  replaceIfUnauthenticated?: string | {
    href: string;
    options?: NavigateOptions;
  };
};

export default function Auth({
  className,
  ifAuthenticated,
  ifUnauthenticated,
  renderSpinner = true,
  replaceIfAuthenticated,
  replaceIfUnauthenticated,
}: AuthProps) {
  const router = useRouter();
  const { data, error, isValidating } = useAuthUser();

  const isReady = !isValidating;
  const isAuthenticated = data !== undefined;
  const isUnauthenticated = data === undefined && error === undefined;

  useEffect(() => {
    if (isReady) {
      if (isAuthenticated && replaceIfAuthenticated !== undefined) {
        if (typeof replaceIfAuthenticated === "string") {
          router.replace(replaceIfAuthenticated);
        } else {
          router.replace(replaceIfAuthenticated.href, replaceIfAuthenticated.options);
        }
      } else if (isUnauthenticated && replaceIfUnauthenticated !== undefined) {
        if (typeof replaceIfUnauthenticated === "string") {
          router.replace(replaceIfUnauthenticated);
        } else {
          router.replace(replaceIfUnauthenticated.href, replaceIfUnauthenticated.options);
        }
      }
    }

    if (isReady && isUnauthenticated && replaceIfUnauthenticated !== undefined) {
      if (typeof replaceIfUnauthenticated === "string") {
        router.replace(replaceIfUnauthenticated);
      } else {
        router.replace(replaceIfUnauthenticated.href, replaceIfUnauthenticated.options);
      }
    }
  }, [isAuthenticated, isReady, isUnauthenticated, replaceIfAuthenticated, replaceIfUnauthenticated, router]);

  return !isReady ? (
    <>
      {renderSpinner ? (
        <div className={classNames("d-block m-auto spinner-border text-primary", className)} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : null}
    </>
  ) : (
    <>
      {isAuthenticated && ifAuthenticated !== undefined ? ifAuthenticated : null}

      {isUnauthenticated && ifUnauthenticated !== undefined ? ifUnauthenticated : null}
    </>
  );
}
