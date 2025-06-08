import classNames from "classnames";
import dayjs from "dayjs";
import { JSX, PropsWithoutRef } from "react";
import BillingPortalButton from "~/components/BillingPortalButton";
import useOrganization from "~/hooks/api/useOrganization";
import usePlan from "~/hooks/api/usePlan";

export type SubscriptionInformationProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function SubscriptionInformation({ className, ...props }: SubscriptionInformationProps) {
  const { data: organization } = useOrganization();
  const { data: plan } = usePlan();

  if (organization === undefined || organization === null || plan === undefined || plan === null) {
    return null;
  }

  return (
    <div {...props} className={classNames("card", className)}>
      <div className="card-body">
        <>
          {organization.isOnTrial && organization.trialEndsAt !== null ? (
            <>
              <p>
                {"You are currently on free trial and your trial will end on  "}
                {dayjs(organization.trialEndsAt).format("ll")}
                .
              </p>

              <p>
                To keep using WebGazer without any interruptions, please start your subscription before your trial ends.
              </p>
            </>
          ) : (
            <>
              <p>
                You are currently on
                {" "}
                {organization.subscriptionPeriodDisplay === null ? null : `${organization.subscriptionPeriodDisplay.toLowerCase()}ly `}

                <span className="fw-bold">
                  {plan.name}

                  {plan.name === "Pro" ? ` - ${plan.maxEventsPerMonthDisplay} events` : null}
                  </span>
                {" "}
                plan.

                {organization.subscriptionCancelAtPeriodEnd ? (
                  <>
                    {" "}
                    Your subscription will be cancelled at the end of the current billing period. If you change your mind, you can renew
                    your subscription at any time, or switch to a different plan.
                  </>
                ) : null}
              </p>
            </>
          )}

          {organization.isStripeCustomer ? (
            <>
              <p>
                Please use the billing portal to update your billing information, or see your invoices and receipts.
              </p>

              <BillingPortalButton />
            </>
          ) : null}
        </>
      </div>
    </div>
  );
}
