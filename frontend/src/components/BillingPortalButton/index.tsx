import classNames from "classnames";
import { JSX, PropsWithoutRef, ReactNode, useCallback, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import useOrganization from "~/hooks/api/useOrganization";
import { api } from "~/lib/api";
import { NewError } from "~/lib/errors";

export type BillingPortalButtonProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["button"]>, {
  children?: ReactNode;
}>;

type State = {
  isInProgress: boolean;
};

export default function BillingPortalButton({ children = "Go to Billing Portal", className, ...props }: BillingPortalButtonProps) {
  const { data: organization } = useOrganization();
  const [state, setState] = useState<State>({ isInProgress: false });
  const { showBoundary } = useErrorBoundary();
  const handleClick = useCallback(async () => {
    setState((s) => ({ ...s, isInProgress: true }));

    try {
      const response = await api.post("/organization/stripe-billing-portal-session");
      const responseJson = await response.json();

      window.location.href = responseJson.redirectUrl;
    } catch (error) {
      showBoundary(NewError(error));

      setState((s) => ({ ...s, isInProgress: false }));
    }
  }, [showBoundary]);

  return organization?.isStripeCustomer ? (
    <button
      {...props}
      className={classNames("align-items-center btn btn-primary d-flex gap-3", className)}
      disabled={state.isInProgress}
      onClick={handleClick}
      type="button"
    >
      {state.isInProgress ? (
        <span className="spinner-border spinner-border-sm" />
      ) : null}
      {children}
    </button>
  ) : null;
}
