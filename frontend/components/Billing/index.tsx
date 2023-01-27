import dayjs from "dayjs";
import React, { useContext, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Breadcrumb, Layout, Plans, Title } from "..";
import { AuthAndApiContext, PlansContext, PlansContextValue, PlansContextState } from "../../contexts";
import { BillingPortalButton } from "./BillingPortalButton";

export function Billing() {
  const { organization } = useContext(AuthAndApiContext);
  const [plansContextState, setPlansContextState] = useState<PlansContextState>({ isDisabled: false, subscriptionPeriod: "MONTH" });

  const billingPortalNode = useMemo<React.ReactNode>(() => {
    if (organization !== null && organization.stripeCustomerId !== null) {
      return (
        <>
          <p>
            You can use the billing portal to change your subscription plan, update your payment method and see your invoices.
          </p>

          <BillingPortalButton />
        </>
      );
    }

    return null;
  }, [organization]);

  const descriptionNode = useMemo<React.ReactNode>(() => {
    if (organization === null) {
      return null;
    }

    if (organization.isOnTrial && organization.trialEndsAt !== null) {
      return (
        <>
          <p>
            {"You are currently on free trial and your trial will end on  "}
            {dayjs(organization.trialEndsAt).format("ll")}
            .
          </p>

          <p>
            To keep using PoeticMetric without any interruptions, please start your subscription before your trial ends.
          </p>
        </>
      );
    }

    if (organization.plan === null) {
      return (
        <p>You don&apos;t have an active subscription. Please start your subscription to continue to use PoeticMetric.</p>
      );
    }

    return (
      <p>
        {"You are currently on "}

        <strong>
          {organization.plan.name}

          {organization.subscriptionPeriodDisplay === null ? null : ` (${organization.subscriptionPeriodDisplay})`}
        </strong>

        {" plan."}
      </p>
    );
  }, [organization]);

  const plansContextValue = useMemo<PlansContextValue>(() => ({ ...plansContextState, set: setPlansContextState }), [plansContextState]);

  return (
    <PlansContext.Provider value={plansContextValue}>
      <Layout kind="app">
        <Title>Billing</Title>

        <Container className="py-5">
          <Breadcrumb title="Billing" />

          {descriptionNode}

          {billingPortalNode}

          <Plans />
        </Container>
      </Layout>
    </PlansContext.Provider>
  );
}
