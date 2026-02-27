import { useEffect } from "react";
import { useNavigate } from "react-router";
import Description from "~/components/Description";
import Title from "~/components/Title";
import useAuthentication from "~/hooks/useAuthentication";

export default function SelfHostedHome() {
  const navigate = useNavigate();
  const { state: authenticationState, user } = useAuthentication();

  useEffect(() => {
    if (authenticationState.isNavigationInProgress) {
      return;
    }

    navigate(user !== null && user !== undefined ? "/sites" : "/sign-in", { replace: true });
  }, [authenticationState.isNavigationInProgress, navigate, user]);

  return (
    <>
      <Title>Free and open source, privacy-friendly Google Analytics alternative</Title>

      <Description>
        PoeticMetric is a free as in freedom, open source, privacy-first and regulation-compliant website analytics tool. You can keep track
        of your website&apos;s traffic without invading your visitors&apos; privacy.
      </Description>
    </>
  );
}

export const Component = SelfHostedHome;
