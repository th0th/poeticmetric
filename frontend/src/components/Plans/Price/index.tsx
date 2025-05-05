import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode, useContext, useMemo } from "react";
import PlansContext, { monthlyEventCountSteps } from "~/contexts/PlansContext";
import { Plan } from "../plans";

export type PriceProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  plan: Plan;
}>;

export default function Price({ className, plan }: PriceProps) {
  const { monthlyEventCountStepIndex, subscriptionPeriod } = useContext(PlansContext);

  const contentNode = useMemo<ReactNode>(() => {
    if (typeof plan.price === "string") {
      return (
        <span className="fs-2 fw-semi-bold">{plan.price}</span>
      );
    }

    if ("amount" in plan.price) {
      return (
        <>
          <div className="bottom-100 fs-7 fw-medium text-body-secondary position-absolute">from</div>

          <span className="fs-2 fw-semi-bold">{`$${plan.price.amount}`}</span>

          <span>{`/${plan.price.subscriptionPeriod === "YEAR" ? "yr" : "mo"}`}</span>
        </>
      );
    }

    return (
      <>
        {subscriptionPeriod === "YEAR" ? (
          <div className="bottom-100 fs-7 fw-medium text-body-secondary text-decoration-line-through position-absolute">
            {`$${12 * plan.price[monthlyEventCountSteps[monthlyEventCountStepIndex]]}/yr`}
          </div>
        ) : null}

        <span className="fs-2 fw-semi-bold">
        {`$${(subscriptionPeriod === "YEAR" ? 10 : 1) * plan.price[monthlyEventCountSteps[monthlyEventCountStepIndex]]}`}
      </span>

        <span>{`/${subscriptionPeriod === "YEAR" ? "yr" : "mo"}`}</span>
      </>
    );
  }, [plan.price, monthlyEventCountStepIndex, subscriptionPeriod]);

  return (
    <div className={classNames("mt-10 position-relative", className)}>{contentNode}</div>
  );
}
