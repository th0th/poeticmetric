import { NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { api } from "../../helpers";

type State = {
  isBootstrapStatusChecked: boolean;
};

type WrappedProps = {
  pageProps: AppProps["pageProps"];
};

export function withAuth(Page: NextPage, authenticated: boolean, ownerOnly?: true) {
  function Wrapped({ pageProps }: WrappedProps) {
    const router = useRouter();
    const { isReady, user } = useContext(AuthAndApiContext);
    const { addToast } = useContext(ToastsContext);
    const isBootstrapStatusChecked = useRef<boolean>(process.env.NEXT_PUBLIC_HOSTED === "true");
    const [state, setState] = useState<State>({ isBootstrapStatusChecked: process.env.NEXT_PUBLIC_HOSTED === "true" });

    const isPermitted = useMemo<boolean>(() => {
      if (!state.isBootstrapStatusChecked) {
        return false;
      }

      if (!authenticated) {
        return user === null;
      }

      if (ownerOnly) {
        return !!user?.isOrganizationOwner;
      }

      return user !== null;
    }, [state.isBootstrapStatusChecked, user]);

    const spinnerNode = useMemo(() => (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
        <Spinner variant="primary" />
      </div>
    ), []);

    const content = useMemo<React.ReactNode>(() => {
      if (!isReady || !isPermitted) {
        return spinnerNode;
      }

      return (
        <Page {...pageProps} />
      );
    }, [isPermitted, isReady, pageProps, spinnerNode]);

    const checkBootstrapStatus = useCallback(async () => {
      const response = await api.get("/bootstrap-status");
      const responseJson = await response.json();

      if (!response.ok) {
        addToast({ body: responseJson.detail || "An error has occurred.", variant: "danger" });

        return;
      }

      if (responseJson.isReady) {
        await router.replace("/bootstrap");

        return;
      }

      setState((s) => ({ ...s, isBootstrapStatusChecked: true }));
    }, [addToast, router]);

    useEffect(() => {
      if (!isBootstrapStatusChecked.current) {
        isBootstrapStatusChecked.current = true;

        checkBootstrapStatus();
      }
    }, [checkBootstrapStatus]);

    useEffect(() => {
      if (!state.isBootstrapStatusChecked) {
        return;
      }

      if (!isPermitted && isReady) {
        if (user !== null) {
          const next = router.query.next === undefined ? null : router.query.next.toString();

          router.replace(next || "/sites/reports");
        } else {
          router.replace(`/sign-in?next=${router.asPath}`);
        }
      }
    }, [isPermitted, isReady, router, state.isBootstrapStatusChecked, user]);

    if (!isPermitted) {
      return spinnerNode;
    }

    return content;
  }

  return Wrapped;
}
