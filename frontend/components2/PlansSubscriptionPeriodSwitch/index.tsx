import React from "react";

type SubscriptionPeriod = "month" | "year";

export type PlansSubscriptionPeriodSwitchProps = {
  subscriptionPeriod: SubscriptionPeriod;
};

export default function PlansSubscriptionPeriodSwitch({ subscriptionPeriod }: PlansSubscriptionPeriodSwitchProps) {
  return (
    <div className="align-items-center d-flex flex-row form-check form-switch gap-2">
      <input
        checked={subscriptionPeriod === "year"}
        className="form-check-input"
        id="flexSwitchCheckDefault"
        // onChange={handleChange}
        role="switch"
        type="checkbox"
      />

      <label className="form-check-label fs-5 fw-medium" htmlFor="flexSwitchCheckDefault">Yearly billing (2 months free)</label>
    </div>
  );
}
