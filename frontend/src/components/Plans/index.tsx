import classNames from "classnames";
import { millify } from "millify";
import { ChangeEvent, JSX, PropsWithoutRef, useState } from "react";
import PlansContext, { monthlyEventCountSteps, PlansContextState } from "~/contexts/PlansContext";
import useAuthenticationOrganization from "~/hooks/api/useAuthenticationOrganization";
import Button from "./Button";
import Features from "./Features";
import Price from "./Price";
import { plans } from "./plans";

export type PlansProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function Plans({ ...props }: PlansProps) {
  const { data: authenticationOrganization } = useAuthenticationOrganization();
  const [state, setState] = useState<PlansContextState>({
    monthlyEventCountStepIndex: 0,
    planNameInProgress: null,
    subscriptionPeriod: authenticationOrganization?.subscriptionPeriod || "MONTH",
  });

  function handleMonthlyEventCountStepIndexChange(event: ChangeEvent<HTMLInputElement>) {
    const monthlyEventCountStepIndex = Number(event.target.value);

    if (monthlyEventCountStepIndex < monthlyEventCountSteps.length) {
      setState((s) => ({ ...s, monthlyEventCountStepIndex }));
    }
  }

  function toggleIsSubscriptionPeriodYear() {
    setState((s) => ({ ...s, subscriptionPeriod: s.subscriptionPeriod === "MONTH" ? "YEAR" : "MONTH" }));
  }

  return (
    <PlansContext.Provider value={{ ...state, monthlyEventCountSteps, set: setState }}>
      <section {...props}>
        <fieldset disabled={state.planNameInProgress !== null}>
          <div className="mw-36rem mx-auto">
            <label className="form-label" htmlFor="input-monthly-event-count-step-index">
              <span className="fs-4 fw-semi-bold">{millify(monthlyEventCountSteps[state.monthlyEventCountStepIndex])}</span>

              <span> monthly page views</span>
            </label>

            <input
              className="form-range"
              id="input-monthly-event-count-step-index"
              max={monthlyEventCountSteps.length - 1}
              min={0}
              onChange={handleMonthlyEventCountStepIndexChange}
              type="range"
              value={state.monthlyEventCountStepIndex}
            />
          </div>

          <div className="align-items-center d-flex fw-medium gap-6 justify-content-center mt-16 px-16">
            <button
              className={classNames(
                "btn-unstyled text-decoration-none",
                state.subscriptionPeriod === "MONTH" ? "text-reset" : "text-body-tertiary",
              )}
              onClick={() => setState((s) => ({ ...s, subscriptionPeriod: "MONTH" }))}
              type="button"
            >
              Monthly billing
            </button>

            <div className="form-check form-switch fs-3 mb-0 min-h-0 px-0">
              <input
                checked={state.subscriptionPeriod === "YEAR"}
                className="form-check-input mt-0 mx-0"
                id="input-plans-yearly"
                onChange={toggleIsSubscriptionPeriodYear}
                role="switch"
                type="checkbox"
              />
            </div>

            <button
              className={classNames(
                "btn-unstyled position-relative text-decoration-none",
                state.subscriptionPeriod === "YEAR" ? "text-reset" : "text-body-tertiary",
              )}
              onClick={() => setState((s) => ({ ...s, subscriptionPeriod: "YEAR" }))}
              type="button"
            >
              Yearly billing

              <div className="bottom-100 fs-8 fw-semi-bold position-absolute start-50 text-nowrap text-primary translate-middle-x">
                2 months free!
              </div>
            </button>
          </div>

          <div className="mt-16">
            <div className="gy-16 row row-cols-1 row-cols-lg-3">
              {plans.map((plan) => (
                <div className="col" key={plan.name}>
                  <div className="card d-flex flex-column">
                    <div className="card-body">
                      <h5 className="card-title fw-semi-bold">{plan.name}</h5>

                      <div className="h-5rem mt-8 text-body-secondary">{plan.description}</div>

                      <Price plan={plan} />

                      <Button plan={plan} />

                      <Features plan={plan} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </fieldset>
      </section>
    </PlansContext.Provider>
  );
}

