import React, { useCallback, useContext, useState } from "react";
import { Button } from "react-bootstrap";
import { AuthAndApiContext, ToastsContext } from "../../../contexts";

export type BillingPortalButtonProps = {
  className?: string;
};

export function BillingPortalButton({ className }: BillingPortalButtonProps) {
  const { api, organization } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const goToBillingPortal = useCallback(async () => {
    setIsDisabled(true);
    const response = await api.post("/organization/stripe-billing-portal-session");
    const responseJson = await response.json();

    if (response.ok) {
      window.location.assign(responseJson.url);
    } else {
      addToast({ body: responseJson.detail, variant: "danger" });
      setIsDisabled(false);
    }
  }, [addToast, api]);

  return organization !== null && organization.stripeCustomerId !== null ? (
    <Button className={`mt-3 ${className}`} disabled={isDisabled} onClick={goToBillingPortal} type="button">
      Go to Billing Portal
    </Button>
  ) : null;
}
