"use client";

import millify from "millify";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Client from "~components/Client";

export type PlansProps = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

const plans: Array<Plan> = [
  {
    description: "A straightforward, privacy-focused analytics solution for small businesses",
    isPriorityEmailSupportEnabled: false,
    maxEventsPerMonth: 100_000,
    maxUsers: 1,
    name: "Basic",
    priceMonthly: 12,
  },
  {
    description: "A comprehensive analytics solution for growing businesses",
    isPriorityEmailSupportEnabled: false,
    maxEventsPerMonth: 1_000_000,
    maxUsers: 10,
    name: "Pro",
    priceMonthly: 20,
  },
  {
    description: "High-capacity event tracking for large organizations",
    isPriorityEmailSupportEnabled: true,
    maxEventsPerMonth: 5_000_000,
    maxUsers: 50,
    name: "Business",
    priceMonthly: 60,
  },
];

export default function Plans({ className, ...props }: PlansProps) {
  const router = useRouter();
  const pathname = usePathname();

  const subscriptionPeriod = useMemo<"month" | "year">(() => {
    return pathname === "/pricing/yearly" ? "year" : "month";
  }, [pathname]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    router.push(event.target.checked ? "/pricing/yearly" : "/pricing");
  }, [router]);

  return (
    <div {...props} className={className}>
      <div className="align-items-center d-flex flex-column p-3">
        <div className="align-items-center d-flex flex-row form-check form-switch gap-2">
          <input
            checked={subscriptionPeriod === "year"}
            className="form-check-input"
            id="plans-subscription-period-switch"
            onChange={handleChange}
            role="switch"
            type="checkbox"
          />

          <label className="form-check-label fs-5 fw-medium" htmlFor="plans-subscription-period-switch">
            Yearly billing (2 months free)
          </label>
        </div>
      </div>

      <div className="gy-4 row row-cols-1 row-cols-lg-3">
        {plans.map((plan) => (
          <div className="col" key={plan.name}>
            <div className="card h-100">
              <div className="card-body">
                <h4>{plan.name}</h4>

                <div className="fs-sm fw-medium text-muted">{plan.description}</div>

                <hr className="mx-n3 mb-2 text-muted" />

                <div>
                  <div>
                    <span className="fs-2 fw-bold">
                      {subscriptionPeriod === "year" ? `$${plan.priceMonthly * 10}` : `$${plan.priceMonthly}`}
                    </span>

                    <span>{subscriptionPeriod === "year" ? "/yr" : "/mo"}</span>
                  </div>

                  <div className="fs-sm fw-medium text-muted">
                    {subscriptionPeriod === "year" ? (
                      <>
                        <del>{`$${12 * plan.priceMonthly}`}</del>

                        {" paid yearly"}
                      </>
                    ) : (
                      <div className="fs-sm fw-medium text-muted">{" paid monthly"}</div>
                    )}
                  </div>
                </div>

                <ul className="mt-3">
                  <li>
                    <Client>
                      <OverlayTrigger
                        overlay={(
                          <Tooltip className="fs-xs fw-medium">
                            It&apos;s truly your data. We don&apos;t sell or monetize your data in any way. You can export or purge all of
                            it at any time.
                          </Tooltip>
                        )}
                        placement="bottom"
                        rootClose
                        trigger={["focus", "hover"]}
                      >
                        <a className="border-secondary border-2 border-bottom border-dotted cursor-pointer text-body-emphasis text-decoration-none">
                          100% data ownership
                        </a>
                      </OverlayTrigger>
                    </Client>
                  </li>

                  <li>Unlimited websites</li>

                  <li>{`${millify(plan.maxEventsPerMonth)} monthly page views`}</li>

                  <li>{plan.maxUsers === 1 ? "Single account" : `${plan.maxUsers} team members`}</li>

                  {plan.isPriorityEmailSupportEnabled ? (
                    <li>
                      <Client>
                        <OverlayTrigger
                          overlay={(
                            <Tooltip className="fs-xs fw-medium">
                              You get e-mail support directly from an engineer when you need.
                            </Tooltip>
                          )}
                          placement="bottom"
                          rootClose
                          trigger={["focus", "hover"]}
                        >
                          <a className="border-secondary border-2 border-bottom border-dotted cursor-pointer text-body-emphasis text-decoration-none">
                            Priority support
                          </a>
                        </OverlayTrigger>
                      </Client>
                    </li>
                  ) : null}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <div className="text-center">
            {"If you need a plan with "}
            <strong>more events</strong>
            {" or "}
            <strong>team members</strong>
            {", "}
            <a href="mailto:support@poeticmetric.com?subject=Custom%20pricing%20plan">
              reach out to us
            </a>
            {" so we can tailor a plan for your needs."}
          </div>
        </div>
      </div>
    </div>
  );
}
