import { loadStripe } from "@stripe/stripe-js";
import React, { useCallback, useContext, useMemo } from "react";
import { Button, ButtonProps } from "react-bootstrap";
import { AuthAndApiContext, PlansContext, ToastsContext } from "../../../contexts";

export type ActionButtonProps = Overwrite<Omit<ButtonProps, "children" | "disabled" | "onClick" | "type">, {
  plan: Plan;
}>;

export function ActionButton({ plan, ...props }: ActionButtonProps) {
  const { api, organization } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const { isDisabled, set, subscriptionPeriod } = useContext(PlansContext);

  const isShown = useMemo<boolean>(() => {
    if (organization === null) {
      return false;
    }

    return organization.plan === null || organization.stripeCustomerId === null;
  }, [organization]);

  const buttonContent = useMemo<string>(() => (organization?.plan === null ? "Subscribe" : "Change plan"), [organization]);

  const handleClick = useCallback(async () => {
    if (organization === null || plan === undefined) {
      return;
    }

    set((s) => ({ ...s, isDisabled: true }));

    try {
      const response = await api.post("/organization/stripe-checkout-session", { planName: plan.name, subscriptionPeriod });
      const responseJson = await response.json();

      if (response.ok) {
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_POETICMETRIC_STRIPE_API_PUBLISHABLE_KEY as string);

        await stripe?.redirectToCheckout({ sessionId: responseJson.stripeCheckoutSessionId });
      } else {
        addToast({ body: responseJson.detail, variant: "danger" });
      }
    } catch (e) {
      addToast({ body: "An error has occurred. Please try again later.", variant: "danger" });
    } finally {
      set((s) => ({ ...s, isDisabled: false }));
    }
  }, [addToast, api, organization, plan, set, subscriptionPeriod]);

  return isShown ? (
    <Button {...props} disabled={isDisabled} onClick={handleClick} type="button">
      {buttonContent}
    </Button>
  ) : null;
}
