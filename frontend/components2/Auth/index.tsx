"use client";

import classNames from "classnames";
import useAuthUser from "../../hooks/useAuthUser";

export type AuthProps = {
  className?: string;
  ifAuthenticated?: React.ReactNode;
  ifUnauthenticated?: React.ReactNode;
  renderSpinner?: boolean;
};

export default function Auth({ className, ifAuthenticated, ifUnauthenticated, renderSpinner = true }: AuthProps) {
  const { data, isValidating } = useAuthUser();

  if (data === undefined && isValidating) {
    return renderSpinner ? (
      <div className={classNames("d-block spinner-border text-primary", className)} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    ) : null;
  }

  return (
    <>
      {data === undefined && ifUnauthenticated !== undefined ? ifUnauthenticated : null}
      {data !== undefined && ifAuthenticated !== undefined ? ifAuthenticated : null}
    </>
  );
}
