/* eslint-disable-next-line */
interface Window {
  $chatwoot?: {
    hasLoaded: boolean;
    setUser: (email: string, params: setUserParams) => void;
    toggleBubbleVisibility: (a: "hide" | "show") => void;
  };
  plausible?: (eventName: string, eventProperties?: Record<string, string>) => void;
}
