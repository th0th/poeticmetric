import { NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { AuthAndApiContext } from "../../contexts";

type WrappedProps = {
  pageProps: AppProps["pageProps"];
};

export function withAuth(Page: NextPage, authenticated: boolean, ownerOnly?: true) {
  function Wrapped({ pageProps }: WrappedProps) {
    const router = useRouter();
    const { user } = useContext(AuthAndApiContext);

    const isPermitted = useMemo<boolean>(() => {
      if (!authenticated) {
        return user === null;
      }

      if (ownerOnly) {
        return !!user?.isOrganizationOwner;
      }

      return user !== null;
    }, [user]);

    const spinnerNode = useMemo(() => (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Spinner variant="primary" />
      </div>
    ), []);

    const content = useMemo<React.ReactNode>(() => {
      if (!isPermitted) {
        return spinnerNode;
      }

      return (
        <Page {...pageProps} />
      );
    }, [isPermitted, pageProps, spinnerNode]);

    useEffect(() => {
      if (!isPermitted) {
        if (user !== null) {
          const next = router.query.next === undefined ? null : router.query.next.toString();

          router.replace(next || "/sites/reports");
        } else {
          router.replace(`/sign-in?next=${router.asPath}`);
        }
      }
    }, [isPermitted, router, user]);

    if (!isPermitted) {
      return spinnerNode;
    }

    return content;
  }

  return Wrapped;
}
