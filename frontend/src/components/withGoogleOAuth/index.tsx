import { GoogleOAuthProvider } from "@react-oauth/google";
import { ComponentType } from "react";
import { googleClientID } from "~/lib/base";

export function withGoogleOauth<Props extends object>(Component: ComponentType<Props>) {
  function Wrapped({ ...props }: Props) {
    return googleClientID !== undefined && googleClientID !== "none" ? (
      <GoogleOAuthProvider clientId={googleClientID}>
        <Component {...props} />
      </GoogleOAuthProvider>
    ) : null;
  }

  return Wrapped;
}
