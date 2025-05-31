import { useCallback, useContext, useMemo } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Link } from "react-router";
import PlansContext from "~/contexts/PlansContext";
import useOrganization from "~/hooks/api/useOrganization";
import usePlan from "~/hooks/api/usePlan";
import { api } from "~/lib/api";

export type ButtonProps = {
  plan: Plan;
};

export default function Button({ plan }: ButtonProps) {
  const { showBoundary } = useErrorBoundary();
  const { data: organization } = useOrganization();
  const { data: organizationPlan } = usePlan();
  const { monthlyEventCountStepIndex, monthlyEventCountSteps, planNameInProgress, set, subscriptionPeriod } = useContext(PlansContext);
  const isDisabled = useMemo(() => {
    if (organization === undefined || organizationPlan === undefined) {
      return false;
    }

    if (plan.price === "Free" && organization.subscriptionCancelAtPeriodEnd) {
      return true;
    }

    if (organizationPlan.name === "Hobbyist" && plan.name === "Hobbyist") {
      return true;
    }

    if (
      !organization.subscriptionCancelAtPeriodEnd
      && organizationPlan.name === plan.name
      && organizationPlan.maxEventsPerMonth === monthlyEventCountSteps[monthlyEventCountStepIndex]
      && organization.subscriptionPeriod === subscriptionPeriod
    ) {
      return true;
    }

    return false;
  }, [monthlyEventCountStepIndex, monthlyEventCountSteps, organization, organizationPlan, plan, subscriptionPeriod]);

  const changePlan = useCallback(async (plan: Plan) => {
    set((s) => ({ ...s, planNameInProgress: plan.name }));

    const response = await api.post("/organization/change-plan", {
      maxEventsPerMonth: monthlyEventCountSteps[monthlyEventCountStepIndex],
      planName: plan.name,
      subscriptionPeriod,
    });

    const responseJson = await response.json();

    if (response.ok) {
      if (responseJson.redirectUrl !== null) {
        window.location.href = responseJson.redirectUrl;
      } else {
        set((s) => ({ ...s, planNameInProgress: null }));
      }
    } else {
      showBoundary(JSON.stringify(responseJson));
    }
  }, [monthlyEventCountStepIndex, monthlyEventCountSteps, set, showBoundary, subscriptionPeriod]);

  if (plan.requiresSalesContact) {
    return (
      <Link className="btn btn-primary btn-sm d-block mt-10 w-100" to="/contact">Contact us</Link>
    );
  }

  return organization !== undefined ? (
    <button
      className="align-items-center btn btn-primary btn-sm d-flex gap-4 justify-content-center mt-10 w-100 "
      disabled={isDisabled}
      onClick={() => changePlan(plan)}
      type="button"
    >
      {planNameInProgress === plan.name ? (
        <span className="spinner-border spinner-border-sm" />
      ) : null}

      {plan.price === "Free" && organization.subscriptionCancelAtPeriodEnd ? "Scheduled" : "Change plan"}
    </button>
  ) : plan.name === "Hobbyist" ? (
    <Link className="btn btn-primary btn-sm d-block mt-10 w-100" to="/sign-up">Get started</Link>
  ) : (
    <>
      <Link className="btn btn-primary btn-sm d-block mt-10 w-100" to="/sign-up">Start free trial</Link>
      <small className="fs-8 mt-2 text-muted">No credit card required.</small>
    </>
  );
}
