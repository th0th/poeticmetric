import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Auth from "~components/Auth";
import getIsHosted from "~helpers/getIsHosted";
import SignInForm from "~components/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function Page() {
  return (
    <div className="container">
      <div className="text-center">
        <h1>Sign in to continue</h1>

        {getIsHosted() ? (
          <div className="mt-3">
            {"Don't have an account? "}

            <Link href="/sign-up">Sign up</Link>
          </div>
        ) : null}
      </div>

      <Auth
        className="mt-4 mx-auto"
        ifUnauthenticated={(
          <SignInForm className="mt-4 mx-auto" />
        )}
      />
    </div>
  );
}
