import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

export function withGoogleOauth<Props extends {}>(Component: React.ComponentType<Props>) {
  function Wrapped({ ...props }: Props) {
    if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === undefined) {
      return (
        <Component {...props} />
      );
    }

    return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <Component {...props} />
      </GoogleOAuthProvider>
    );
  }

  return Wrapped;
}
