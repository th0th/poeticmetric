import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AuthAndApiContext } from "../../contexts";
import { setUserAccessToken } from "../../helpers";

type State = {
  isDone: boolean;
  isReady: boolean;
};

export function SignOut() {
  const router = useRouter();
  const { mutate } = useContext(AuthAndApiContext);
  const [state, setState] = useState<State>({ isDone: false, isReady: false });

  const signOut = useCallback(async () => {
    setUserAccessToken(null);
    await mutate();
    await router.replace("/");
  }, [mutate, router]);

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
    <Spinner className="m-auto" variant="primary" />
  );
}
