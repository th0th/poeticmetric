import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import useAuthentication from "~/hooks/useAuthentication";

export default function EmailAddressVerificationBlock() {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isEmailVerified) {
      navigate("/email-address-verification");
    }
  }, [navigate, user]);

  if (user?.isEmailVerified === true) {
    return <Outlet />;
  }

  return (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center p-8">
      <div className="spinner-border text-primary" />
    </div>
  );
}

export const Component = EmailAddressVerificationBlock;
