import posthog, { PostHog } from "posthog-js";
import { PostHogProvider as Provider } from "posthog-js/react";
import { ReactNode, useEffect, useEffectEvent, useState } from "react";
import { posthogAPIKey } from "~/lib/base";

export type PostHogProviderProps = {
  children: ReactNode;
};

type State = {
  postHogClient: PostHog | undefined;
};

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const [state, setState] = useState<State>({ postHogClient: undefined });

  const setPostHogClient = useEffectEvent((postHogClient: State["postHogClient"]) => {
    setState((s) => ({ ...s, postHogClient }));
  });

  useEffect(() => {
    if (posthogAPIKey !== undefined && state.postHogClient === undefined) {
      posthog.init(posthogAPIKey, { api_host: "/ingest" });

      setPostHogClient(posthog);
    }
  }, [state.postHogClient]);

  return state.postHogClient === undefined ? children : (
    <Provider client={state.postHogClient}>{children}</Provider>
  );
}
