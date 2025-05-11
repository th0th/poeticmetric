import { useCallback, useContext } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Link } from "react-router";
import PlansContext from "~/contexts/PlansContext";
import useAuthenticationOrganization from "~/hooks/api/useAuthenticationOrganization";
import useAuthenticationPlan from "~/hooks/api/useAuthenticationPlan";
import { api } from "~/lib/api";

export type ButtonProps = {
  plan: Plan;
};

export default function Button({ plan }: ButtonProps) {
  const { showBoundary } = useErrorBoundary();
  const { data: organization } = useAuthenticationOrganization();
  const { data: authenticationPlan } = useAuthenticationPlan();
  const { planNameInProgress, set, subscriptionPeriod } = useContext(PlansContext);

  const changePlan = useCallback(async (plan: Plan) => {
    set((s) => ({ ...s, planNameInProgress: plan.name }));

    const response = await api.post("/organization/change-plan", {
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
  }, [set, showBoundary, subscriptionPeriod]);

  return organization !== undefined ? (
    <button
      className="align-items-center btn btn-primary btn-sm d-flex gap-4 justify-content-center mt-10 w-100 "
      disabled={
        (plan.price === "Free" && organization.subscriptionCancelAtPeriodEnd)
        || (
          !organization.subscriptionCancelAtPeriodEnd &&
          organization.subscriptionPeriod === subscriptionPeriod &&
          authenticationPlan?.name === plan.name
        ) || (
          authenticationPlan?.name === "Hobbyist" && plan.name === "Hobbyist"
        )
      }
      onClick={() => changePlan(plan)}
      type="button"
    >
      {planNameInProgress === plan.name ? (
        <>
          <span className="spinner-border spinner-border-sm" />
          {" "}
        </>
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
