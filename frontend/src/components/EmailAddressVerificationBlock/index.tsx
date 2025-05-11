import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router";
import useAuthentication from "~/hooks/useAuthentication";

export type EmailAddressVerificationBlockProps = {
  children: ReactNode;
};

export default function EmailAddressVerificationBlock({ children }: EmailAddressVerificationBlockProps) {
  const { user } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.isEmailVerified) {
      navigate("/email-address-verification");
    }
  }, [navigate, user]);

  return user?.isEmailVerified === false ? (
    <div className="align-items-center d-flex flex-grow-1 justify-content-center p-8">
      <div className="spinner-border text-primary" />
    </div>
  ) : children;
}
