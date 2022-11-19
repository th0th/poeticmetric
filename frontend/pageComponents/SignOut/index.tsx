import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AuthAndApiContext } from "../../contexts";
import { api } from "../../helpers";

type State = {
  isDone: boolean;
  isReady: boolean;
};

export function SignOut() {
  const router = useRouter();
  const { setUserAccessToken } = useContext(AuthAndApiContext);
  // const { addToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ isDone: false, isReady: false });

  const signOut = useCallback(async () => {
    if (router.query.skipCall !== "true") {
      await api.delete("/user-access-tokens");
    }

    setUserAccessToken(null);

    if (router.query.skipToast !== "true") {
      // addToast({ children: 'You have successfully signed out.', status: 'success' });
    }

    await router.replace("/");
  }, [router, setUserAccessToken]);

  useEffect(() => {
    if (router.isReady && !state.isReady) {
      setState((s) => ({ ...s, isReady: true }));
    }
  }, [router.isReady, state.isReady]);

  useEffect(() => {
    if (state.isReady && !state.isDone) {
      setState((s) => ({ ...s, isDone: true }));

      signOut();
    }
  }, [signOut, state]);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Spinner animation="border" />
    </div>
  );
}
