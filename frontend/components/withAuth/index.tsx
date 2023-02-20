import { NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AuthContext, ToastsContext } from "../../contexts";
import { api } from "../../helpers";
import { UnverifiedEmailAddressBlock } from "../UnverifiedEmailAddressBlock";

type State = {
  isBootstrapStatusChecked: boolean;
};

type WrappedProps = {
  pageProps: AppProps["pageProps"];
};

export function withAuth(Page: NextPage, authenticated: boolean, ownerOnly?: true) {
  function Wrapped({ pageProps }: WrappedProps) {
    const router = useRouter();
    const { isReady, user } = useContext(AuthContext);
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
        if (authenticated) {
          router.replace(`/sign-in?next=${router.asPath}`);
        } else {
          router.replace(typeof router.query.next === "string" ? router.query.next : "/sites");
        }
      }
    }, [isPermitted, isReady, router, state.isBootstrapStatusChecked, user]);

    if (!isReady || !isPermitted) {
      return (
        <Spinner className="m-auto" variant="primary" />
      );
    }

    if (user !== null && !user.isEmailVerified) {
      return (
        <UnverifiedEmailAddressBlock />
      );
    }

    return (
      <Page {...pageProps} />
    );
  }

  return Wrapped;
}
