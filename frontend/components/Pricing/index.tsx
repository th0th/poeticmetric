import Link from "next/link";
import { useContext, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Description, Layout, Plans, Title } from "..";
import { AuthContext, PlansContext, PlansContextState, PlansContextValue } from "../../contexts";
import { Faq } from "./Faq";

export function Pricing() {
  const { user } = useContext(AuthContext);
  const [plansContextState, setPlansContextState] = useState<PlansContextState>({ isDisabled: false, subscriptionPeriod: "MONTH" });

  const plansContextValue = useMemo<PlansContextValue>(() => ({ ...plansContextState, set: setPlansContextState }), [plansContextState]);

  return (
    <Layout kind="website">
      <Title>Pricing</Title>
      <Description>
        Get the insights and analytics you need to grow your business with PoeticMetric. Our pricing plans are flexible and designed to fit
        the needs of businesses of all sizes. Explore our pricing page to find the perfect plan for you.
      </Description>

      <Container className="py-5">
        <div className="mw-34rem">
          <h1>Simple pricing</h1>

          <div className="fs-5 mw-34rem mt-3">
            <p>
              {"Get started with a 30-day free trial on the  "}
              <strong>Business</strong>
              {" plan and then pay a fair price according to your traffic."}
            </p>

            <p>No credit card is required for the free trial.</p>
          </div>
        </div>

        <PlansContext.Provider value={plansContextValue}>
          <Plans signUp />
        </PlansContext.Provider>

        {user === null ? (
          <div className="align-items-center d-flex flex-column mt-4">
            <Link className="btn btn-lg btn-primary" href="/sign-up">Start your free trial</Link>
          </div>
        ) : null}

        <Faq className="pb-0" />
      </Container>
    </Layout>
  );
}
