import { useRouter } from "next/router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Layout, Title } from "..";
import { AuthAndApiContext, ToastsContext } from "../../contexts";
import { api, setUserAccessToken } from "../../helpers";

type State = {
  isDone: boolean;
};

export function EmailAddressVerification() {
  const router = useRouter();
  const { mutate } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [state, setState] = useState<State>({ isDone: false });

  const verifyEmailAddress = useCallback(async () => {
    const response = await api.post("/users/verify-email-address", { emailVerificationToken: router.query.t });
    const responseJson = await response.json();

    if (response.ok) {
      setUserAccessToken(responseJson.userAccessToken.token);
      addToast({
        body: "Congratulations! Your 30-day free trial of PoeticMetric has been enabled. Get ready to boost your website's performance!",
        variant: "success",
      });
      await mutate();
      await router.push("/sites");
    } else {
      addToast({
        body: (
          <>
            {"This link is not valid. Please contact "}
            <a className="text-white" href="mailto:support@poeticmetric.com">support</a>
            {" if you need help."}
          </>
        ),
        variant: "danger",
      });

      await router.replace("/sign-in");
    }
  }, [addToast, mutate, router]);

  useEffect(() => {
    if (router.isReady && !state.isDone) {
      verifyEmailAddress();

      setState((s) => ({ ...s, isDone: true }));
    }
  }, [router.isReady, state.isDone, verifyEmailAddress]);

  return (
    <Layout kind="app">
      <Title>E-mail address verification</Title>

      <Container className="align-items-center d-flex flex-column justify-content-center flex-grow-1">
        <Spinner variant="primary" />
      </Container>
    </Layout>
  );
}
