import { NextPage } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";
import { EmailVerificationHandler, SubscriptionHandler } from "..";
import { AuthContext, ToastsContext } from "../../contexts";
import { api } from "../../helpers";

type State = {
  isBootstrapStatusChecked: boolean;
  isReady: boolean;
};

type WrappedProps = {
  pageProps: AppProps["pageProps"];
};

export function withAuth(Page: NextPage, authenticated: boolean, ownerOnly?: true) {
  function Wrapped({ pageProps }: WrappedProps) {
    const router = useRouter();
    const { isReady: isAuthReady, user } = useContext(AuthContext);
    const { addToast } = useContext(ToastsContext);
    const [state, setState] = useState<State>({ isBootstrapStatusChecked: process.env.NEXT_PUBLIC_HOSTED === "true", isReady: false });

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
      if (!state.isBootstrapStatusChecked) {
        checkBootstrapStatus();
      }
    }, [checkBootstrapStatus, state.isBootstrapStatusChecked]);

    useEffect(() => {
      if (!state.isBootstrapStatusChecked || !isAuthReady) {
        return;
      }

      if (!isPermitted) {
        if (authenticated) {
          router.replace(`/sign-in?next=${router.asPath}`);
        } else {
          router.replace(typeof router.query.next === "string" ? router.query.next : "/sites");
        }
      }
    }, [isAuthReady, isPermitted, router, state.isBootstrapStatusChecked]);

    return !isAuthReady || !isPermitted ? (
      <Spinner className="m-auto" variant="primary" />
    ) : (
      <EmailVerificationHandler>
        <SubscriptionHandler>
          <Page {...pageProps} />
        </SubscriptionHandler>
      </EmailVerificationHandler>
    );
  }

  return Wrapped;
}
