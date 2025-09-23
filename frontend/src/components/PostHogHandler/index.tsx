import { usePostHog } from "posthog-js/react";
import { useEffect, useMemo, useRef } from "react";
import useAuthenticationUser from "~/hooks/api/useAuthenticationUser";
import useOrganization from "~/hooks/api/useOrganization";
import usePlan from "~/hooks/api/usePlan";

export default function PostHogHandler() {
  const posthog = usePostHog();
  const { data: user } = useAuthenticationUser();
  const { data: organization } = useOrganization();
  const { data: plan } = usePlan();
  const data = useMemo(() => ({ organization, plan, user }), [organization, plan, user]);
  const previousData = useRef<typeof data>(null);

  useEffect(() => {
    if (posthog.__loaded && JSON.stringify(data) !== JSON.stringify(previousData.current)) {
      if (
        data.organization !== undefined
        && data.organization !== null
        && data.plan !== undefined
        && data.plan !== null
        && data.user !== undefined
        && data.user !== null
      ) {
        posthog.identify(data.user.id.toString(), {
          email: data.user.email,
          isOrganizationOwner: data.user.isOrganizationOwner,
          name: data.user.name,
        });

        posthog.group("organization", data.organization.id.toString(), {
          isOnTrial: data.organization.isOnTrial,
          name: data.organization.name,
          planName: data.plan.name,
        });
      } else {
        posthog.reset();
      }

      previousData.current = data;
    }
  }, [data, posthog]);

  return null;
}
