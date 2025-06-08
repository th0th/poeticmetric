import { usePostHog } from "posthog-js/react";

export default function useCapture() {
  const posthog = usePostHog();

  function capture(eventName: string, eventProperties?: Record<string, any>) {
    posthog?.capture(eventName, eventProperties);
  }

  return capture;
}
